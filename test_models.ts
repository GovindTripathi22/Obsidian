
import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config({ path: ".env.local" });

async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ No GEMINI_API_KEY found in .env.local");
        return;
    }

    console.log(`🔑 Key found: ${apiKey.substring(0, 8)}...`);

    // 1. Direct REST call to list models (The Source of Truth)
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        console.log("📡 Querying API for available models...");
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", JSON.stringify(data.error, null, 2));
            return;
        }

        if (!data.models) {
            console.error("❌ No models returned. Response:", JSON.stringify(data, null, 2));
            return;
        }

        console.log("✅ Models available to this key:");
        const modelNames = data.models.map((m: any) => m.name.replace("models/", ""));
        modelNames.forEach((name: string) => console.log(`   - ${name}`));

        // 2. Recommend the best fit
        const preferred = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash-001",
            "gemini-2.0-flash-exp"
        ];

        const bestMatch = preferred.find(p => modelNames.includes(p));

        if (bestMatch) {
            console.log(`\n🎉 RECOMMENDED FIX: Change code to use '${bestMatch}'`);
        } else {
            console.log("\n⚠️ No standard flash models found. You might have a constrained key.");
        }

    } catch (error) {
        console.error("❌ Network/Script Error:", error);
    }
}

checkModels();
