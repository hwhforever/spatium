# 🚀 Spatium V2 - AI-Powered Project Management

A modern React application built with Vite, featuring AI-powered content generation through Google's Generative AI API.

## ✨ Features

- **🔐 User Authentication**: Secure email/password authentication with Supabase
- **Drag & Drop Interface**: Intuitive project tile management with grid snapping
- **AI Content Generation**: Secure Google AI integration for dynamic content creation
- **Multiple Themes**: 5 beautiful themes (Dark, Space, Bloomberg, Ocean, Forest)
- **Project Wizard**: 4-step project setup with comprehensive core data collection
- **Template Library**: Pre-built templates for various project needs
- **Local Storage**: Persistent data storage for project management
- **Responsive Design**: Modern UI with hover animations and smooth transitions

## 🛠 Tech Stack

- **Frontend**: React 19.1.1 + Vite
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS 4.1.12
- **AI Integration**: Google Generative AI (Gemini Pro)
- **Deployment**: Vercel with serverless functions
- **Storage**: Browser localStorage + Supabase

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google AI API key ([Get one here](https://makersuite.google.com/app/apikey))
- Supabase account ([Sign up here](https://app.supabase.com))

### Local Development

1. **Clone and install dependencies:**
   ```bash
   cd spatium-v2
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```
   # Supabase Configuration (REQUIRED for authentication)
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Google AI API Key (REQUIRED for AI features)
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   ```

3. **Set up Supabase Authentication:**
   
   a. Create a new project at [app.supabase.com](https://app.supabase.com)
   
   b. Go to Settings > API to get your project URL and anon key
   
   c. Go to Authentication > Settings and configure:
   - Enable email confirmations (optional)
   - Set your site URL to `http://localhost:5175` for development
   - For production, add your Vercel domain
   
   d. The authentication is already configured in the app - no additional tables needed!

4. **Set up the Projects Database Table:**
   
   a. In your Supabase dashboard, go to "SQL Editor"
   
   b. Click "New Query" and paste this SQL:
   ```sql
   -- Create the projects table
   CREATE TABLE projects (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
       name TEXT NOT NULL,
       is_setup_complete BOOLEAN DEFAULT false,
       core JSONB DEFAULT '{}',
       position_x INTEGER DEFAULT 30,
       position_y INTEGER DEFAULT 30,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

   -- Create security policies
   CREATE POLICY "Users can view own projects" ON projects
       FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own projects" ON projects
       FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own projects" ON projects
       FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own projects" ON projects
       FOR DELETE USING (auth.uid() = user_id);
   ```
   
   c. Click "Run" to execute the query
   
   d. Your projects will now be stored securely in the database!

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **For serverless function testing (optional):**
   ```bash
   # Install Vercel CLI globally
   npm install -g vercel
   
   # Start local development with serverless functions
   vercel dev
   ```

7. **Open your browser:**
   - Vite dev server: `http://localhost:5173`
   - Vercel dev: `http://localhost:3000`

## 🌐 Deployment to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set environment variables:**
   ```bash
   vercel env add GOOGLE_AI_API_KEY
   ```
   Enter your Google AI API key when prompted.

### Method 2: Vercel Dashboard

1. **Connect your repository** to Vercel via the dashboard
2. **Add environment variable:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `GOOGLE_AI_API_KEY` with your API key
3. **Deploy** from the dashboard

## 📁 Project Structure

```
spatium-v2/
├── api/
│   └── generate.js          # Vercel serverless function for AI proxy
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.jsx    # Main dashboard with drag & drop
│   │   ├── ProjectView.jsx  # AI-powered project interface
│   │   ├── ProjectTile.jsx  # Individual project tiles
│   │   └── ...             # Other UI components
│   ├── utils/              # Utility functions
│   │   ├── aiService.js    # AI API service client
│   │   ├── localStorage.js # Data persistence
│   │   └── templateLibrary.js # Template definitions
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles and themes
├── .env.example            # Environment variables template
├── vercel.json             # Vercel deployment configuration
└── package.json            # Dependencies and scripts
```

## 🔐 Security Features

- **API Key Protection**: Google AI API key is stored securely on the server
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Validation**: Request validation and sanitization
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Rate Limiting**: Built-in Vercel function limits prevent abuse

## 🎨 Available Themes

1. **Dark** - Classic dark theme with electric blue accents
2. **Space** - Deep purple with cosmic vibes
3. **Bloomberg** - Professional black with gold highlights
4. **Ocean** - Deep blue gradient with aqua accents
5. **Forest** - Earth tones with green highlights

## 🧩 AI Templates

The application includes pre-built templates for:
- Product Roadmap Generation
- Market Research Analysis
- Technical Documentation
- User Story Creation
- Business Model Canvas
- And more...

## 🔧 Configuration

### Vercel Configuration (`vercel.json`)
```json
{
  "functions": {
    "api/generate.js": {
      "maxDuration": 30
    }
  },
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Environment Variables
- `GOOGLE_AI_API_KEY`: Your Google AI API key (required for AI features)

## 📚 API Reference

### POST `/api/generate`

Generate AI content using Google's Generative AI.

**Request Body:**
```json
{
  "prompt": "Your prompt text here"
}
```

**Response:**
```json
{
  "success": true,
  "text": "Generated content...",
  "usage": {
    "promptTokens": 10,
    "completionTokens": 50,
    "totalTokens": 60
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **AI generation not working:**
   - Check that `GOOGLE_AI_API_KEY` is set correctly
   - Verify the API key has proper permissions
   - Check browser console for error messages

2. **Build failures:**
   - Ensure all dependencies are installed: `npm install`
   - Check Node.js version (18+ required)

3. **Vercel deployment issues:**
   - Verify `vercel.json` configuration
   - Check environment variables in Vercel dashboard
   - Review function logs in Vercel dashboard

### Development Tips

- Use `npm run build` to test production builds locally
- Check the browser's Network tab for API call debugging
- Use `vercel logs` to view serverless function logs

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review Vercel and Google AI documentation
- Open an issue in the repository

---

Built with ❤️ using React, Vite, and Google AI+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
