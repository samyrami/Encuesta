# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Sustainability Assessment System for Universities** - A comprehensive web application that evaluates university sustainability across three dimensions: Environmental, Social, and Governance (ESG). Developed by the **Government Laboratory** and **International Trade Laboratory** at Universidad de La Sabana.

### Key Features
- Interactive sustainability questionnaire (44 questions across 3 dimensions)
- Real-time scoring and progress tracking
- Comprehensive diagnostic reports with strengths, weaknesses, and recommendations
- PDF/text export functionality
- Optional AI-powered chat for specialized guidance (OpenAI integration)
- Persistent state management with localStorage
- Responsive design with shadcn/ui components

## Architecture & Tech Stack

### Frontend Framework
- **React 18** with TypeScript
- **Vite** as build tool and dev server
- **React Router DOM** for routing
- **Tailwind CSS** + **shadcn/ui** for styling
- **Radix UI** components for accessibility

### State Management
- Custom hooks with **useState** and **useCallback**
- **localStorage** for persistence
- **React Query** (@tanstack/react-query) for API state

### Key Components Structure
```
src/
├── components/
│   ├── SustainabilityAssistant.tsx    # Main component orchestrator
│   ├── SustainabilityResults.tsx      # Results display with scoring
│   ├── SustainabilityChat.tsx         # AI-powered chat interface
│   └── ChatMessage.tsx                # Message display component
├── hooks/
│   └── useSustainabilityAssistant.ts  # Main logic hook
├── data/
│   ├── sustainability-questionnaire.v2.ts  # Question definitions & scoring
│   └── universities.ts                # University list
└── utils/
    ├── persistence.ts                 # localStorage management
    └── debug.ts                      # Debugging utilities
```

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → Runs on http://localhost:8080/

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Development build (with source maps)
npm run build:dev
```

### Production Deployment
```bash
# Build and start for production (Heroku compatible)
npm run build
npm start
# → Uses PORT environment variable or defaults to 3000
```

## Key Architecture Patterns

### Evaluation Flow
1. **Welcome** → **Profile Collection** → **Questionnaire** → **Results** → **Chat**
2. State persisted automatically in localStorage
3. Questions organized by dimensions: Ambiental (12), Social (14), Gobernanza (18)
4. Scoring: 1-5 scale per question, averaged per dimension and overall

### Scoring Algorithm
- **Individual Question**: 1-5 points
- **Dimension Score**: Average of all answered questions in that dimension
- **Overall Score**: Average of all three dimension scores
- **Categories**: Strengths (≥4), Weaknesses (≤2), Regular (3)

### Data Models
```typescript
interface SustainabilityResults {
  profile: UserProfile;
  responses: SustainabilityResponse[];
  dimensions: {
    ambiental: DimensionResult;
    social: DimensionResult;
    gobernanza: DimensionResult;
  };
  overallScore: number;
  completedAt: Date;
}
```

## Common Development Tasks

### Running Tests
Currently no test suite configured. To add testing:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Adding New Questions
1. Edit `src/data/sustainability-questionnaire.v2.ts`
2. Follow the existing question format with 5-option scale
3. Include recommendations for each score level
4. Assign to appropriate dimension: 'Ambiental' | 'Social' | 'Gobernanza'

### Debugging Scoring Issues
Use browser console commands:
```javascript
// Check current state
debugSustainabilityApp()

// Clear corrupted data
clearAllSustainabilityData()
```

### OpenAI Integration Setup
1. Create `.env` file with:
   ```
   VITE_OPENAI_API_KEY=your-api-key-here
   ```
2. The app works without API key (chat feature disabled)
3. API key can also be provided at runtime via UI prompt

## Known Issues & Solutions

### Score Display Showing 0.0/5.0
**Cause**: Corrupted localStorage data or null score values
**Solution**: 
1. Open browser console (F12)
2. Run: `clearAllSustainabilityData()`
3. Refresh page

### AI Chat Not Working  
**Cause**: Missing or invalid OpenAI API key
**Solution**: Set `VITE_OPENAI_API_KEY` in environment or provide via UI

### Build Warnings About NODE_ENV
**Expected**: Vite shows warning about NODE_ENV in .env file - this is normal

## File Organization Principles

- **Components**: Organized by feature (Sustainability, Chat, UI)
- **Hooks**: Custom hooks for complex state logic
- **Data**: Static data definitions and configurations
- **Utils**: Pure utility functions and helpers
- **Types**: TypeScript interfaces (embedded in respective files)

## Environment Variables

```bash
# Optional - for AI chat functionality
VITE_OPENAI_API_KEY=sk-...

# Production - set automatically by hosting platform
PORT=3000
```

## Performance Considerations

- **Bundle size**: Uses dynamic imports for html2pdf.js
- **State persistence**: Automatic localStorage saves (throttled)
- **Large datasets**: Questions and universities loaded statically
- **Memory**: Session data cleared after 24 hours

## Browser Support

- **Modern browsers**: Chrome 88+, Firefox 85+, Safari 14+
- **Features used**: localStorage, ES6 modules, async/await
- **Responsive**: Mobile-first design with Tailwind breakpoints

## Integration Points

- **OpenAI API**: GPT-3.5-turbo for chat functionality
- **Export**: html2pdf.js for PDF generation
- **Icons**: Lucide React icon library
- **Fonts**: System font stack via Tailwind

This sustainability assessment system provides a comprehensive evaluation framework for universities to measure and improve their ESG practices, with a focus on actionable recommendations and continuous improvement tracking.