import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Apex Athletics Server' });
  });

  /**
   * Multi-turn Chatbot endpoint with Google Maps Grounding & model tier selection
   * Models supported:
   * - Fast: 'gemini-3.1-flash-lite'
   * - General / Maps: 'gemini-3.5-flash'
   * - Complex: 'gemini-3.1-pro-preview'
   */
  app.post('/api/chat', async (req, res) => {
    try {
      const {
        message,
        history = [],
        modelTier = 'general',
        userLocation,
        useMaps = false,
      } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Check if message asks for location, facilities, grounds, pitch, court, tracks, stores
      const locationKeywords = [
        'near me', 'nearby', 'location', 'where can i', 'store', 'shop',
        'pitch', 'court', 'turf', 'stadium', 'track', 'gym', 'field', 'find'
      ];
      const hasLocationIntent = locationKeywords.some((kw) =>
        message.toLowerCase().includes(kw)
      );

      const shouldGroundWithMaps = useMaps || hasLocationIntent;

      // Select model based on task requirement
      // Maps Grounding requires gemini-3.5-flash
      let selectedModel = 'gemini-3.5-flash';
      if (!shouldGroundWithMaps) {
        if (modelTier === 'fast') {
          selectedModel = 'gemini-3.1-flash-lite';
        } else if (modelTier === 'complex') {
          selectedModel = 'gemini-3.1-pro-preview';
        } else {
          selectedModel = 'gemini-3.5-flash';
        }
      }

      const systemInstruction = `You are the Apex Athletics Pro AI Concierge & Technical Kit Specialist.
Your mission is to provide athletes, runners, players, and trainers with expert advice on:
1. Apex Athletic match kits & gear:
   - International National Jerseys (Brazil Authentic, Argentina 3-Star Champions, France FFF, Japan Samurai Blue).
   - European Club Matchwear (Real Madrid White Royale, Manchester City Treble Gold, Arsenal Highbury Cannon, Paris Saint-Germain Nocturne).
   - Professional Soccer Cleats & Boots (Apex Phantom Carbon Elite FG with dual-density carbon soleplates, Predator SpeedMatrix).
   - Performance Athletic Trainers (Apex NitroFuel Marathon Super-Trainer with supercritical nitrogen foam, HyperAgility Barbell Cross-Trainers).
   - Core kits (Soccer Vanguard AeroMatch, Basketball Velocity Eclipse, Running Stratosphere Ultralight, Training Apex Core Armor).
2. Material sciences: AeroWeave™ 110g fabric, HydroVent™ cooling, GripKnit 360° boot upper texture, NitroFuel™ rebound foam, and sizing guides (apparel S-XL, footwear US 8-12).
3. Global currency conversion: The store supports USD, EUR, GBP, CAD, AUD, JPY, NGN, BRL, INR, and AED with instant localized pricing.
4. Sports facilities, local soccer pitches, basketball courts, running tracks, and athletic stores using Google Maps grounding.

Guidelines:
- Maintain an energetic, confident, athletic, and encouraging tone.
- When Google Maps grounding returns places, cite the venue names accurately and describe why they are optimal for athletic training or matches.
- Keep answers scannable with bullet points and bold text where helpful.
- For kit recommendations, state the discipline, key fabric advantage, and price.`;

      // Build contents array for multi-turn history
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      // Add previous conversation turns
      for (const turn of history) {
        if (turn && turn.text && (turn.role === 'user' || turn.role === 'model')) {
          contents.push({
            role: turn.role,
            parts: [{ text: turn.text }],
          });
        }
      }

      // Append current user message
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const config: Record<string, any> = {
        systemInstruction,
      };

      // Add Google Maps tool if grounding is enabled
      if (shouldGroundWithMaps) {
        config.tools = [{ googleMaps: {} }];
        if (userLocation && typeof userLocation.latitude === 'number') {
          config.toolConfig = {
            retrievalConfig: {
              latLng: {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              },
            },
          };
        }
      }

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config,
      });

      const responseText = response.text || '';

      // Extract Google Maps grounding chunks and place review sources
      const rawGroundingChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      const mapPlaces: Array<{
        title: string;
        uri?: string;
        snippets?: string[];
      }> = [];

      for (const chunk of rawGroundingChunks) {
        if ((chunk as any).maps) {
          const mapData = (chunk as any).maps;
          const title = mapData.title || 'Google Maps Location';
          const uri = mapData.uri || '';
          const snippets: string[] = [];

          if (mapData.placeAnswerSources?.reviewSnippets) {
            for (const snip of mapData.placeAnswerSources.reviewSnippets) {
              if (snip && snip.reviewText) {
                snippets.push(snip.reviewText);
              }
            }
          }

          mapPlaces.push({ title, uri, snippets });
        }
      }

      res.json({
        reply: responseText,
        modelUsed: selectedModel,
        mapPlaces,
        hasMapsGrounding: shouldGroundWithMaps && mapPlaces.length > 0,
      });
    } catch (error: any) {
      console.error('Gemini Chat Error:', error);
      res.status(500).json({
        error: error.message || 'Failed to generate response from Gemini AI',
      });
    }
  });

  /**
   * Dedicated Sports Venue & Court Finder endpoint powered by gemini-3.5-flash with googleMaps
   */
  app.post('/api/find-facilities', async (req, res) => {
    try {
      const { sport = 'Soccer', query, userLocation } = req.body;

      const prompt = query
        ? `Find premier ${sport} facilities, courts, pitches, or athletic tracks for: "${query}". Include the address, surface quality, and why athletes recommend it.`
        : `Find the best rated public and club ${sport} facilities, pitches, courts, or training venues nearby. List top options with details on facilities and lighting.`;

      const config: Record<string, any> = {
        tools: [{ googleMaps: {} }],
        systemInstruction:
          'You are the Apex Athletics Facilities Scout. Use Google Maps grounding to locate real, premier sports venues, courts, tracks, and pitches. Provide practical athlete details like surface type (turf, hardwood, polyurethane track) and access.',
      };

      if (userLocation && typeof userLocation.latitude === 'number') {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
          },
        };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config,
      });

      const responseText = response.text || '';
      const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      const mapPlaces: Array<{
        title: string;
        uri?: string;
        snippets?: string[];
      }> = [];

      for (const chunk of rawChunks) {
        if ((chunk as any).maps) {
          const mapData = (chunk as any).maps;
          const title = mapData.title || 'Athletic Facility';
          const uri = mapData.uri || '';
          const snippets: string[] = [];
          if (mapData.placeAnswerSources?.reviewSnippets) {
            for (const s of mapData.placeAnswerSources.reviewSnippets) {
              if (s && s.reviewText) snippets.push(s.reviewText);
            }
          }
          mapPlaces.push({ title, uri, snippets });
        }
      }

      res.json({
        description: responseText,
        venues: mapPlaces,
      });
    } catch (error: any) {
      console.error('Find Facilities Error:', error);
      res.status(500).json({
        error: error.message || 'Failed to locate sports facilities',
      });
    }
  });

  // Mount Vite middleware in development or serve static in production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Apex Athletics server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
