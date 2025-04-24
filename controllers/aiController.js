const { Groq } = require('groq-sdk'); 
const groqClient = new Groq({apiKey: process.env.GROQ_API_KEY});
exports.getFinancialInsights = async (req, res) => {
  try {
    const { expenses } = req.body;
    const expenseDescriptions = expenses.map(
      (exp) => `${exp.description} - $${exp.amount}`
    ).join("; ");

    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Imagine you're a friendly and practical financial advisor. Analyze the following expenses and provide clear, to-the-point advice on spending habits, savings, and smart investments. Keep it simple—no complicated jargon. Your response should be compact, well-structured, and under 500 words, avoiding using to much line breaks or gaps bro be compact, gaps between your lines are way to much try giving at max 2 paragraphs thats it not more than that, try to include whatever you want to say in those paragraphs being compact. Start directly with the heading 'Your Customized AI Insights'—do not acknowledge the user at the beginning with phrases like 'Thank you for sharing' or similar.",
        },
        {
          role: "user",
          content: expenseDescriptions,
        },
      ],
      model: 'deepseek-r1-distill-llama-70b',
      max_tokens: 2048,
      temperature: 1,
      reasoning_format: "hidden",
    });

      const insights = chatCompletion.choices[0].message.content;

    res.json({ insights });
  } catch (error) {
      console.error(error);
    res.status(500).json({ error: "Failed to generate insights" });
  }
};