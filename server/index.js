require('dotenv').config()
const express = require('express')
const { PrismaClient } = require('./generated/prisma');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authMiddleware = require('./middleware/auth')
const { HfInference } = require('@huggingface/inference'); 


// const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const prisma = new PrismaClient()
const allowedOrigin = process.env.CLIENT_ORIGIN_URL || 'http://localhost:5173';


app.use(cors({
  origin: allowedOrigin
}));

app.use(express.json())
const hf = new HfInference(process.env.HF_API_KEY);

app.post('/api/ai/generate-insight', authMiddleware, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));
    const recentWorkouts = await prisma.workout.findMany({
      where: { userId: req.userId, date: { gte: sevenDaysAgo } },
      include: { exercise: true },
    });

    if (recentWorkouts.length < 2) {
      return res.json({ insight: "Log a few more workouts this week to get your first AI insight!" });
    }

    const workoutSummary = recentWorkouts.map(workout => {
        const exercisesSummary = workout.exercise.map(ex => 
          `- ${ex.name} (${ex.sets} sets of ${ex.reps} reps)`
        ).join('\n');
        return `On ${workout.date.toDateString()}, the workout was '${workout.name}':\n${exercisesSummary}`;
      }).join('\n\n');

    const prompt = `You are a motivating and friendly fitness coach. Analyze the following summary of a user's workouts from the last 7 days. Provide a short, encouraging, and actionable insight (2-3 sentences). Do not give medical advice. Focus on consistency, variety, or potential areas for improvement. Here is the data:\n\n${workoutSummary}`;

    // --- THIS IS THE CORRECTED PART ---
    // We are now using hf.chatCompletion
    const result = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      messages: [{ role: "user", content: prompt }], // Structure the prompt as a message
      max_tokens: 100,
    });

    const insightText = result.choices[0].message.content;
    // --- END OF CORRECTED PART ---

    res.json({ insight: insightText });
  } catch (error) {
    console.error("AI Insight Error (Hugging Face):", error);
    res.status(500).json({ error: "Failed to generate AI insight." });
  }
});


// app.post('/api/ai/generate-insight', authMiddleware, async (req, res) => {
//   try {
//     const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));
//     const recentWorkouts = await prisma.workout.findMany({
//       where: {
//         userId: req.userId,
//         date: { gte: sevenDaysAgo },
//       },
//       include: { exercise: true },
//     });
//     if (recentWorkouts.length < 2) {
//       return res.json({ insight: "Log more workouts to get insights" })
//     }
//     const workoutSummaries = recentWorkouts.map(workout => `On ${workout.date.toDateString()}, you did a workout named "${workout.name}" with ${workout.exercise.length} exercises.`).join('\n');


//     const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
//     const prompt = `You are a motivating and friendly fitness coach. Analyze the following summary of a user's workouts from the last 7 days. Provide a short, encouraging, and actionable insight (2-3 sentences). Do not give medical advice. Focus on consistency, variety, or potential areas for improvement. Here is the data:\n\n${workoutSummaries}`;

//     const result = await model.generateContent(prompt);
//     const insightText = result.response.text();

//     res.json({ insight: insightText });
//   } catch (error) {
//     console.error("AI Insight Error:", error);
//     res.status(500).json({ error: "Failed to generate AI insight." });
//   }
// });




app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
});
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,

      }
    })
    res.status(201).json({ Id: user.id, email: user.email, name: user.name, })

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: "Email already exists" })
    }
    res.status(500).json({ error: "Internal server error" })
  }

})
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: email }
    })
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" })
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" })

    }
    const payload = {
      user: {
        id: user.id,
      }
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' })
    res.json({ token: token })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/workouts", authMiddleware, async (req, res) => {
  try {
    const { name, exercises } = req.body;
    const newWorkout = await prisma.$transaction(async (prisma) => {
      const workout = await prisma.workout.create({
        data: {
          name: name,
          userId: req.userId,
        }
      })
      const exerciseData = exercises.map((exercise) => ({
        ...exercise,
        workoutId: workout.id,
      }))
      await prisma.exerciseLog.createMany({
        data: exerciseData,
      })
      return workout;
    })
    res.status(201).json(newWorkout)
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" })
  }
});


app.get("/api/workouts", authMiddleware, async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: {
        userId: req.userId,
      },
      include: { exercise: true },
      orderBy: {
        date: 'desc',
      }
    })
    res.json(workouts)
  } catch (error) {
    res.status(500).json({ error: "something went wrong " })
  }
})
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },

    })
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword)
  } catch (error) {
    res.status(500).json({ error: "something went wrong" })
  }
})
app.put('/api/user/goal', authMiddleware, async (req, res) => {
  const { goal } = req.body;
  if (typeof goal !== 'number' || goal < 0) {
    return res.status(400).json({ error: 'Invalid goal value.' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: { weeklyWorkoutGoal: goal },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update goal.' });
  }
});
app.get('/api/stats/progress', authMiddleware, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    
    const exercises = await prisma.exerciseLog.findMany({
      where: {
        workout: {
          userId: req.userId,
          date: {
            gte: thirtyDaysAgo,
          },
        },
      },
      include: {
        workout: true, 
      },
    });

    // Process the data into daily stats
    const dailyStats = {};
    exercises.forEach(ex => {
      const date = ex.workout.date.toISOString().split('T')[0]; // Get YYYY-MM-DD
      if (!dailyStats[date]) {
        dailyStats[date] = { volume: 0, workouts: new Set() };
      }
      dailyStats[date].volume += (ex.sets * ex.reps * (ex.weightKg || 0));
      dailyStats[date].workouts.add(ex.workoutId);
    });

    // Format for the frontend
    const formattedStats = Object.keys(dailyStats).map(date => ({
      date,
      totalVolume: dailyStats[date].volume,
      workoutCount: dailyStats[date].workouts.size,
    })).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

    res.json(formattedStats);
  } catch (error) {
    console.error("Progress stats error:", error);
    res.status(500).json({ error: 'Failed to fetch progress stats.' });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
