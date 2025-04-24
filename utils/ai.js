const { Groq } = require('groq-sdk'); 
const groqClient = new Groq({apiKey: process.env.GROQ_API_KEY});

const predictCategory = async (description) => {
    try {
      const chatCompletion = await groqClient.chat.completions.create({
          messages: [{
              role: 'system',
              content: 'You are a helpful assistant that categorizes expenses.  Return only one of these categories: [Food, Transportation, Housing, Entertainment, Healthcare, Education, Other] and your response shoudl be of this form "Expense Name - Category" strictly. no extra words are required to be added'
          },
          {
              role: 'user',
              content: `Categorize this expense: ${description}`
          }],
          model: 'deepseek-r1-distill-llama-70b',
          max_tokens: 2048,
          temperature: 1,
          reasoning_format: "hidden",
      });
        const category = chatCompletion.choices[0].message.content.trim();
    return category;
  } catch (error) {
    console.error('AI Prediction Error:', error);
    return 'Other';
  }
};

module.exports = { predictCategory };