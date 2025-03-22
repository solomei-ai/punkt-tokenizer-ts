import { setupPunkt} from "./index.js";

console.log("📚 Downloading NLTK data...");
setupPunkt()
    .then(() => console.log("✅ Data downloaded successfully."))
    .catch((err) => {
        console.error("❌ Failed to download NLTK data:", err)
        process.exit(1);
    });