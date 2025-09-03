/* eslint-disable no-undef */
// Structured template library grouped by categories
export const templateLibrary = {
  'Strategy & Planning': [
    {
      id: 1,
      name: 'Product Roadmap Generator',
      description: 'Create comprehensive product roadmaps with strategic milestones, feature prioritization, and timeline planning. This template helps you map out your product development journey with clear objectives and measurable outcomes.',
      promptTemplate: `Generate a comprehensive product roadmap for "\${project.name}" - \${project.oneSentencePitch || 'our product'}.

The project addresses this problem: \${project.problemStatement || 'Various user needs and market opportunities'}

Target audience: \${project.targetAudience || 'General users'}

Unique solution approach: \${project.uniqueSolution || 'Innovative features and user experience'}

Please generate a 6-month product roadmap that includes:
1. Key milestones and deliverables
2. Feature prioritization matrix
3. Timeline with dependencies
4. Success metrics and KPIs
5. Risk assessment and mitigation strategies`
    },
    {
      id: 2,
      name: 'Market Research Assistant',
      description: 'Conduct thorough market analysis using AI to identify trends, competitor landscapes, and customer insights. This template helps you gather and synthesize market data to make informed strategic decisions.',
      promptTemplate: `For the project "${project.name}" - ${project.oneSentencePitch || 'a new venture'}, conduct a comprehensive market research analysis.

Problem being solved: ${project.problemStatement || 'Market needs analysis required'}

Target market: ${project.targetAudience || 'Market segments to be identified'}

Competitive advantage: ${project.uniqueSolution || 'Differentiation factors to be analyzed'}

Please provide:
1. Market size and growth potential analysis
2. Competitive landscape mapping
3. Target customer segment analysis
4. Market trends and opportunities
5. Pricing strategy recommendations
6. Go-to-market strategy insights`
    },
    {
      id: 3,
      name: 'User Persona Creator',
      description: 'Build detailed user personas based on data analysis and behavioral patterns. This AI template helps create accurate representations of your target audience for better product development.',
      promptTemplate: `Create detailed user personas for "${project.name}" - ${project.oneSentencePitch || 'our project'}.

Target audience: ${project.targetAudience || 'Users to be defined'}

Problem we solve: ${project.problemStatement || 'User pain points to be identified'}

Our unique approach: ${project.uniqueSolution || 'Solution differentiation'}

Generate 3-4 detailed user personas including:
1. Demographics and psychographics
2. Goals, motivations, and pain points
3. Behavioral patterns and preferences
4. Technology adoption and usage patterns
5. Decision-making processes
6. Key messaging that resonates with each persona`
    }
  ],
  'Marketing & Sales': [
    {
      id: 4,
      name: 'Campaign Performance Optimizer',
      description: 'Optimize your marketing campaigns with AI-driven insights and recommendations. Analyze performance data, identify improvement opportunities, and get actionable suggestions for better ROI.',
      promptTemplate: `Optimize marketing campaigns for "${project.name}" - ${project.oneSentencePitch || 'our offering'}.

Target audience: ${project.targetAudience || 'Marketing targets to be defined'}

Value proposition: ${project.uniqueSolution || 'Key benefits to highlight'}

Market challenge: ${project.problemStatement || 'Market education needs'}

Create a campaign optimization strategy including:
1. Channel-specific messaging and creative recommendations
2. Audience segmentation and targeting strategies
3. Performance metrics and KPI tracking framework
4. A/B testing recommendations
5. Budget allocation optimization
6. Conversion funnel improvement tactics`
    },
    {
      id: 5,
      name: 'Content Strategy Planner',
      description: 'Create compelling content strategies with AI assistance. Generate content calendars, topic suggestions, and performance predictions to maximize engagement and reach.',
      promptTemplate: `Develop a comprehensive content strategy for "${project.name}" - ${project.oneSentencePitch || 'our brand'}.

Audience: ${project.targetAudience || 'Content audience to be defined'}

Core message: ${project.uniqueSolution || 'Brand differentiation to communicate'}

Problem focus: ${project.problemStatement || 'Issues to address through content'}

Generate:
1. 3-month content calendar with themes and topics
2. Content pillar strategy aligned with brand values
3. Platform-specific content recommendations
4. SEO keyword strategy and content optimization
5. Engagement tactics and community building approach
6. Content performance measurement framework`
    },
    {
      id: 6,
      name: 'Sales Funnel Analyzer',
      description: 'Optimize your sales process with AI-powered funnel analysis. Identify bottlenecks, predict conversion rates, and get recommendations for improving sales performance.',
      promptTemplate: `Analyze and optimize the sales funnel for "${project.name}" - ${project.oneSentencePitch || 'our offering'}.

Target customers: ${project.targetAudience || 'Customer segments to be analyzed'}

Value proposition: ${project.uniqueSolution || 'Unique selling points'}

Customer problem: ${project.problemStatement || 'Pain points driving purchase decisions'}

Provide:
1. Complete sales funnel mapping from awareness to conversion
2. Conversion rate optimization recommendations
3. Lead qualification and scoring framework
4. Sales enablement materials and messaging
5. Customer objection handling strategies
6. Retention and upselling opportunities analysis`
    }
  ],
  'Technical': [
    {
      id: 7,
      name: 'Code Review Assistant',
      description: 'Get AI-powered code review suggestions, best practices recommendations, and quality improvements. Enhance your development workflow with automated code analysis and optimization tips.',
      promptTemplate: `Provide a comprehensive code review and quality framework for "${project.name}" - ${project.oneSentencePitch || 'our technical project'}.

Technical challenge: ${project.problemStatement || 'Development challenges to address'}

User base: ${project.targetAudience || 'End users and their technical needs'}

Technical advantage: ${project.uniqueSolution || 'Technology differentiation'}

Develop:
1. Code review checklist and standards
2. Automated testing strategy and coverage requirements
3. Performance monitoring and optimization guidelines
4. Security audit procedures and compliance requirements
5. Documentation standards and API guidelines
6. Deployment and CI/CD pipeline recommendations`
    },
    {
      id: 8,
      name: 'Performance Monitor',
      description: 'Monitor application performance with AI-driven anomaly detection. Get real-time insights, predictive alerts, and optimization recommendations for your technical infrastructure.',
      promptTemplate: `Design a comprehensive performance monitoring strategy for "${project.name}" - ${project.oneSentencePitch || 'our application'}.

System requirements driven by: ${project.problemStatement || 'Performance challenges to solve'}

User expectations: ${project.targetAudience || 'User base performance needs'}

Technical edge: ${project.uniqueSolution || 'Performance advantages to maintain'}

Create:
1. Performance metrics and KPI framework
2. Real-time monitoring and alerting system design
3. Load testing and capacity planning strategy
4. Database and API optimization recommendations
5. User experience performance tracking
6. Incident response and performance recovery procedures`
    },
    {
      id: 9,
      name: 'API Documentation Generator',
      description: 'Automatically generate comprehensive API documentation with AI assistance. Create clear, well-structured docs that improve developer experience and reduce support overhead.',
      promptTemplate: `Generate comprehensive API documentation for "${project.name}" - ${project.oneSentencePitch || 'our platform'}.

Developer needs based on: ${project.problemStatement || 'Integration challenges to solve'}

Target developers: ${project.targetAudience || 'Developer community and their needs'}

API advantages: ${project.uniqueSolution || 'Unique API features and benefits'}

Produce:
1. Complete API reference documentation with examples
2. Getting started guide and authentication setup
3. SDK and integration tutorials for popular frameworks
4. Error handling and troubleshooting guide
5. Rate limiting and best practices documentation
6. Interactive API explorer and testing interface design`
    }
  ]
};
