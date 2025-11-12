import { GoogleGenAI, Modality } from "@google/genai";

// FIX: Corrected the global declaration for window.aistudio to use a named interface `AIStudio`, resolving a type conflict.
declare global {
    interface AIStudio {
        hasSelectedApiKey: () => Promise<boolean>;
        openSelectKey: () => Promise<void>;
    }
    interface Window {
        // FIX: Made 'aistudio' optional to resolve the modifier conflict error.
        aistudio?: AIStudio;
    }
}

// --- STATE & CONFIG ---
let currentLang = "ar";
let currentMode = "global";

const translations = {
    ar: {
        main_title: "منصة كريم شهاد للذكاء الاصطناعي والفن القبطي",
        nav_home: "🏛️ الرئيسية",
        nav_images: "🎨 استوديو الصور",
        nav_coptic: "✝️ الفن القبطي",
        nav_video: "🎬 الفيديو",
        nav_hymn: "🎵 الترانيم",
        nav_script: "🎭 السيناريو",
        nav_knowledge: "📚 المعرفة",
        nav_about: "🌍 عن المنصة",
        lang_btn: "English",
        mode_btn: "🏺 الوضع الفرعوني",
        home_title: "🏛️ الرئيسية",
        home_p: "مرحبًا بك في <b>منصة كريم شهاد</b>، تجربة فنية تجمع بين <span style='color:var(--gold)'>الذكاء الاصطناعي</span> وجمال الفن القبطي والتراث المصري في واجهة عالمية.",
        images_title: "🎨 استوديو الصور",
        images_p: "اكتب وصفاً دقيقاً للصورة التي تريد توليدها بالذكاء الاصطناعي.",
        images_placeholder: "مثال: صورة فوتوغرافية لفرعون مصري مهيب يجلس على عرش من الذهب الخالص، الضوء الذهبي يتدفق من النافذة...",
        generate_image_btn: "⚡ توليد الصورة",
        images_result: "سيتم عرض الصورة المولدة هنا.",
        coptic_title: "✝️ استوديو الفن القبطي",
        coptic_p: "اكتب وصف الأيقونة أو المشهد القبطي الذي تريد توليده بأسلوب فني أصيل.",
        coptic_placeholder: "مثال: أيقونة قبطية للقديس مارمرقس الرسول، بملامح روحانية وخلفية من أوراق الذهب...",
        generate_coptic_btn: "🕊️ توليد الأيقونة",
        coptic_result: "سيتم عرض الأيقونة المولدة هنا.",
        video_title: "🎬 استوديو الفيديو",
        hymn_title: "🎵 قسم الترانيم",
        hymn_p: "اكتب كلمات التranيمة لتحويلها إلى لوحة قصصية (Storyboard) من ثلاثة مشاهد.",
        hymn_placeholder: "مثال: يارب، بارك هذا اليوم واجعله مليئًا بنورك...",
        hymn_storyboard_btn: "🎶 إنشاء Storyboard",
        hymn_result: "سيتم عرض الـ Storyboard هنا.",
        script_title: "🎭 قسم السيناريو / Storyboard",
        script_p: "اكتب فكرة المشهد أو الحوار ليقوم الذكاء الاصطناعي بتحويلها إلى سيناريو قصير.",
        script_placeholder: "مثال: بطل يسير ببطء داخل معبد قديم، حاملاً شعلة تضيء النقوش الهيروغليفية على الجدران...",
        generate_script_btn: "📝 إنشاء السيناريو",
        script_result: "سيتم عرض السيناريو هنا.",
        knowledge_title: "📚 قاعدة المعرفة المسيحية القبطية",
        knowledge_p: "ابحث عن اسم البابا أو القديس أو أي مصطلح كنسي لمعرفة المزيد من المعلومات.",
        knowledge_placeholder: "مثال: البابا كيرلس السادس",
        search_btn: "🔍 بحث",
        knowledge_result: "سيتم عرض نتائج البحث هنا.",
        about_title: "🌍 عن المنصة",
        about_p: "منصة تجمع بين التقنيات الحديثة والإبداع الفني، برؤية عالمية وعمق مصري أصيل.",
        pharaonic_mode_on: "🌍 الوضع العالمي",
        listen_btn: "🔊 استمع",
        listen_loading_btn: "جارٍ التحميل...",
        generating_audio: "🎤 جارٍ توليد الصوت...",
        audio_error: "حدث خطأ أثناء توليد الصوت."
    },
    en: {
        main_title: "Karim Shehad AI & Coptic Art Platform",
        nav_home: "🏛️ Home",
        nav_images: "🎨 Image Studio",
        nav_coptic: "✝️ Coptic Art",
        nav_video: "🎬 Video",
        nav_hymn: "🎵 Hymns",
        nav_script: "🎭 Screenplay",
        nav_knowledge: "📚 Knowledge",
        nav_about: "🌍 About",
        lang_btn: "العربية",
        mode_btn: "🏺 Pharaonic Mode",
        home_title: "🏛️ Home",
        home_p: "Welcome to the <b>Karim Shehad Platform</b>, an artistic experience combining <span style='color:var(--gold)'>Artificial Intelligence</span> with the beauty of Coptic art and Egyptian heritage in a global interface.",
        images_title: "🎨 Image Studio",
        images_p: "Write a detailed description of the image you want to generate with AI.",
        images_placeholder: "Example: A photographic portrait of a majestic Egyptian pharaoh on a throne of pure gold, with golden light streaming from a window...",
        generate_image_btn: "⚡ Generate Image",
        images_result: "The generated image will be displayed here.",
        coptic_title: "✝️ Coptic Art Studio",
        coptic_p: "Describe the Coptic icon or scene you want to generate in an authentic artistic style.",
        coptic_placeholder: "Example: A Coptic icon of Saint Mark the Apostle, with spiritual features and a gold leaf background...",
        generate_coptic_btn: "🕊️ Generate Icon",
        coptic_result: "The generated icon will be displayed here.",
        video_title: "🎬 Video Studio",
        hymn_title: "🎵 Hymns Section",
        hymn_p: "Write the lyrics of the hymn to be converted into a three-scene storyboard.",
        hymn_placeholder: "Example: Lord, bless this day and fill it with your light...",
        hymn_storyboard_btn: "🎶 Create Storyboard",
        hymn_result: "The storyboard will be displayed here.",
        script_title: "🎭 Screenplay / Storyboard Section",
        script_p: "Write the scene idea or dialogue for the AI to turn into a short screenplay.",
        script_placeholder: "Example: A hero walks slowly inside an ancient temple, carrying a torch that illuminates hieroglyphic inscriptions on the walls...",
        generate_script_btn: "📝 Create Screenplay",
        script_result: "The screenplay will be displayed here.",
        knowledge_title: "📚 Coptic Christian Knowledge Base",
        knowledge_p: "Search for the name of a Pope, a Saint, or any church term to learn more.",
        knowledge_placeholder: "Example: Pope Cyril VI",
        search_btn: "🔍 Search",
        knowledge_result: "Search results will be displayed here.",
        about_title: "🌍 About the Platform",
        about_p: "A platform that combines modern technologies and artistic creativity, with a global vision and authentic Egyptian depth.",
        pharaonic_mode_on: "🌍 Global Mode",
        listen_btn: "🔊 Listen",
        listen_loading_btn: "Loading...",
        generating_audio: "🎤 Generating audio...",
        audio_error: "An error occurred while generating audio."
    }
};


// --- HELPERS ---
const showLoading = (container: HTMLElement, message: string) => {
    container.innerHTML = `<p>${message}</p>`;
};

const showError = (container: HTMLElement, message: string) => {
    container.innerHTML = `<p style="color: #ff7b7b;">${message}</p>`;
};

const playClick = () => {
    const sound = document.getElementById("clickSound") as HTMLAudioElement;
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.error("Sound play failed:", e));
    }
}

// --- AUDIO HELPERS ---
let outputAudioContext: AudioContext | null = null;
const getAudioContext = (): AudioContext => {
    if (!outputAudioContext) {
        outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return outputAudioContext;
};

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const showAudioStatus = (container: HTMLElement, message: string, isError: boolean = false) => {
    let statusEl = container.querySelector('.audio-status') as HTMLParagraphElement;
    if (!statusEl) {
        statusEl = document.createElement('p');
        statusEl.className = 'audio-status';
        container.appendChild(statusEl);
    }
    statusEl.textContent = message;
    statusEl.style.color = isError ? '#ff7b7b' : '#aaa';
};

const clearAudioStatus = (container: HTMLElement) => {
    const statusEl = container.querySelector('.audio-status');
    if (statusEl) statusEl.remove();
};


const generateAndPlaySpeech = async (text: string, button: HTMLButtonElement) => {
    const originalText = button.textContent;
    const container = button.parentElement!;
    button.disabled = true;
    button.textContent = translations[currentLang]['listen_loading_btn'];
    showAudioStatus(container, translations[currentLang]['generating_audio']);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' }, // A versatile voice
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received.");
        }
        
        clearAudioStatus(container);
        
        const audioContext = getAudioContext();
        const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        source.onended = () => {
            button.disabled = false;
            button.textContent = originalText;
        };

    } catch(error) {
        console.error("Speech generation error:", error);
        showAudioStatus(container, translations[currentLang]['audio_error'], true);
        button.disabled = false;
        button.textContent = originalText;
    }
}

const addListenButton = (container: HTMLElement) => {
    const existingBtn = container.querySelector('.listen-btn');
    if (existingBtn) existingBtn.remove(); // Remove old button if it exists

    const textContent = container.querySelector('pre')?.innerText;
    if (!textContent) return;

    const listenBtn = document.createElement('button');
    listenBtn.className = 'listen-btn';
    listenBtn.textContent = translations[currentLang]['listen_btn'];
    listenBtn.onclick = () => generateAndPlaySpeech(textContent, listenBtn);
    
    container.appendChild(listenBtn);
}


// --- THEME & LANGUAGE TOGGLING ---
const toggleLang = () => {
    currentLang = currentLang === "ar" ? "en" : "ar";
    const html = document.documentElement;
    html.lang = currentLang;
    html.dir = currentLang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = (el as HTMLElement).dataset.translateKey;
        if (key) {
            const translation = translations[currentLang][key];
            if (translation) {
                if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'text')) {
                    (el as HTMLInputElement | HTMLTextAreaElement).placeholder = translation;
                } else if(key === 'home_p' || key === 'about_p') {
                    el.innerHTML = translation; // Allow HTML for specific keys
                }
                 else {
                    el.textContent = translation;
                }
            }
        }
    });

    document.querySelectorAll('.listen-btn').forEach(btn => {
        btn.textContent = translations[currentLang]['listen_btn'];
    });
};

const toggleMode = () => {
    const music = document.getElementById("pharaonicMusic") as HTMLAudioElement;
    const modeBtn = document.getElementById("modeBtn") as HTMLButtonElement;
    document.body.classList.toggle('pharaonic-mode');

    if (document.body.classList.contains('pharaonic-mode')) {
        currentMode = "pharaonic";
        music.play().catch(e => console.error("Music play failed:", e));
        modeBtn.textContent = translations[currentLang]['pharaonic_mode_on'];
    } else {
        currentMode = "global";
        music.pause();
        music.currentTime = 0;
        modeBtn.textContent = translations[currentLang]['mode_btn'];
    }
}


// --- IMAGE GENERATION ---
const generateImage = async (promptElId: string, resultElId: string, extraPrompt: string = '') => {
    const promptInput = document.getElementById(promptElId) as HTMLTextAreaElement;
    const resultContainer = document.getElementById(resultElId) as HTMLDivElement;
    const button = resultContainer.previousElementSibling as HTMLButtonElement;
    const prompt = promptInput.value.trim();

    if (!prompt) {
        alert(currentLang === 'ar' ? "الرجاء كتابة وصف أولاً." : "Please write a description first.");
        return;
    }

    button.disabled = true;
    showLoading(resultContainer, currentLang === 'ar' ? "🎨 جارٍ توليد الصورة، قد يستغرق الأمر بضع لحظات..." : "🎨 Generating image, this may take a moment...");

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `${extraPrompt} ${prompt}`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        resultContainer.innerHTML = `<img src="${imageUrl}" alt="Generated Image" />`;
    } catch (error) {
        console.error("Image generation error:", error);
        showError(resultContainer, currentLang === 'ar' ? "حدث خطأ أثناء توليد الصورة. الرجاء المحاولة مرة أخرى." : "An error occurred while generating the image. Please try again.");
    } finally {
        button.disabled = false;
    }
};

// --- VIDEO GENERATION ---
const videoContainer = document.getElementById("videoContainer") as HTMLDivElement;
let apiKeySelected = false;

const setupVideoSection = async () => {
    try {
        apiKeySelected = !!window.aistudio && await window.aistudio.hasSelectedApiKey();
    } catch (e) {
        // Fallback for environments where aistudio might not be available.
        apiKeySelected = false; 
    }

    if (apiKeySelected) {
        renderVideoGenerator();
    } else {
        renderSelectKeyUI();
    }
};

const renderSelectKeyUI = () => {
    const content = currentLang === 'ar' ? {
        p1: "لاستخدام استوديو الفيديو، يجب عليك تحديد مفتاح API الخاص بك. هذا مطلوب لأغراض الفوترة والأمان.",
        p2: `لمزيد من المعلومات حول التسعير، يرجى زيارة <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" style="color: var(--violet);">وثائق الفوترة</a>.`,
        btn: "🔑 تحديد مفتاح API"
    } : {
        p1: "To use the video studio, you must select your API key. This is required for billing and security purposes.",
        p2: `For more information about pricing, please visit the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" style="color: var(--violet);">billing documentation</a>.`,
        btn: "🔑 Select API Key"
    };

    videoContainer.innerHTML = `
        <div style="text-align: center;">
            <p>${content.p1}</p>
            <p style="font-size: 0.9rem; color: #aaa; margin-top: 0.5rem;">${content.p2}</p>
            <button class="action" id="selectApiKeyBtn">${content.btn}</button>
        </div>
    `;
    document.getElementById('selectApiKeyBtn')?.addEventListener('click', async () => {
        // FIX: Added a guard to ensure window.aistudio exists before calling its methods, preventing a runtime error.
        if (!window.aistudio) {
            showError(videoContainer, currentLang === 'ar' ? "ميزة الفيديو غير متاحة في هذه البيئة." : "The video feature is not available in this environment.");
            return;
        }
        await window.aistudio.openSelectKey();
        apiKeySelected = true;
        renderVideoGenerator();
    });
};

const renderVideoGenerator = () => {
    const content = currentLang === 'ar' ? {
        p: "اكتب وصف المشهد المراد تحويله إلى فيديو (باللغة الإنجليزية).",
        placeholder: "A majestic pharaoh walking through a golden temple...",
        btn: "🎥 توليد الفيديو",
        result: "سيتم عرض الفيديو هنا بعد التوليد."
    } : {
        p: "Write the description of the scene to be converted into video (in English).",
        placeholder: "A majestic pharaoh walking through a golden temple...",
        btn: "🎥 Generate Video",
        result: "The video will be displayed here after generation."
    };

    videoContainer.innerHTML = `
        <p>${content.p}</p>
        <textarea id="videoPrompt" placeholder="${content.placeholder}"></textarea>
        <button class="action" id="generateVideoBtn">${content.btn}</button>
        <div id="videoOut" class="result-container" style="width: 100%; margin-top: 1rem; background: none; border: none;"><p>${content.result}</p></div>
    `;
    document.getElementById('generateVideoBtn')?.addEventListener('click', generateVideo);
};

const generateVideo = async () => {
    const videoPromptInput = document.getElementById('videoPrompt') as HTMLTextAreaElement;
    const videoOutContainer = document.getElementById('videoOut') as HTMLDivElement;
    const button = document.getElementById('generateVideoBtn') as HTMLButtonElement;
    const prompt = videoPromptInput.value.trim();

    if (!prompt) {
        alert(currentLang === 'ar' ? "الرجاء كتابة وصف الفيديو أولاً." : "Please write a video description first.");
        return;
    }

    button.disabled = true;
    showLoading(videoOutContainer, currentLang === 'ar' ? '⏳ جارٍ إعداد عملية إنشاء الفيديو...' : '⏳ Preparing video generation...');
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        showLoading(videoOutContainer, currentLang === 'ar' ? '🎬 الفيديو قيد الإنشاء... قد يستغرق هذا الأمر بضع دقائق. يرجى الانتظار.' : '🎬 Video is processing... This may take a few minutes. Please wait.');

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        if (operation.error) {
           // FIX: Cast the error message to a string to prevent a type error when creating a new Error.
           // The message property from the operation error might be inferred as 'unknown'.
           throw new Error(String(operation.error.message));
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error(currentLang === 'ar' ? "لم يتم العثور على رابط تنزيل الفيديو." : "Video download link not found.");
        }

        showLoading(videoOutContainer, currentLang === 'ar' ? '📥 جارٍ تحميل الفيديو...' : '📥 Downloading video...');
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const videoBlob = await response.blob();
        const videoUrl = URL.createObjectURL(videoBlob);

        videoOutContainer.innerHTML = `<video src="${videoUrl}" controls autoplay loop style="max-width: 100%; border-radius: 8px;"></video>`;

    } catch (error: any) {
        console.error("Video generation error:", error);
        let errorMessage = currentLang === 'ar' ? "حدث خطأ أثناء إنشاء الفيديو. الرجاء المحاولة مرة أخرى." : "An error occurred during video generation. Please try again.";
        if (error.message?.includes("Requested entity was not found")) {
            errorMessage = currentLang === 'ar' ? "فشل التحقق من مفتاح API. يرجى إعادة تحديد مفتاح صالح." : "API Key validation failed. Please re-select a valid key.";
            renderSelectKeyUI(); // Reset UI to re-select key
        }
        showError(videoOutContainer, errorMessage);
    } finally {
        button.disabled = false;
    }
};

// --- TEXT GENERATION (Hymn, Script) ---
const generateTextContent = async (promptElId: string, resultElId: string, systemInstruction: string) => {
    const promptInput = document.getElementById(promptElId) as HTMLTextAreaElement;
    const resultContainer = document.getElementById(resultElId) as HTMLDivElement;
    const button = resultContainer.previousElementSibling as HTMLButtonElement;
    const prompt = promptInput.value.trim();

    if (!prompt) {
        alert(currentLang === 'ar' ? "الرجاء إدخال النص أولاً." : "Please enter text first.");
        return;
    }

    button.disabled = true;
    showLoading(resultContainer, currentLang === 'ar' ? "✍️ جارٍ الكتابة بواسطة الذكاء الاصطناعي..." : "✍️ AI is writing...");

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        resultContainer.innerHTML = `<pre>${response.text}</pre>`;
        addListenButton(resultContainer);
    } catch (error) {
        console.error("Text generation error:", error);
        showError(resultContainer, currentLang === 'ar' ? "حدث خطأ أثناء إنشاء المحتوى." : "An error occurred while generating content.");
    } finally {
        button.disabled = false;
    }
};

// --- KNOWLEDGE BASE (Search Grounding) ---
const searchKnowledgeBase = async () => {
    const searchInput = document.getElementById('searchSaint') as HTMLInputElement;
    const resultContainer = document.getElementById('infoResult') as HTMLDivElement;
    const button = document.getElementById('searchKnowledgeBtn') as HTMLButtonElement;
    const query = searchInput.value.trim();

    if (!query) {
        alert(currentLang === 'ar' ? "الرجاء إدخال مصطلح البحث." : "Please enter a search term.");
        return;
    }

    button.disabled = true;
    showLoading(resultContainer, currentLang === 'ar' ? `🔍 جارٍ البحث عن معلومات حول "${query}"...` : `🔍 Searching for information about "${query}"...`);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Provide detailed and reliable information about the Coptic term or personality: "${query}".`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        let htmlContent = `<pre>${response.text}</pre>`;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

        if (groundingChunks && groundingChunks.length > 0) {
            const sourcesTitle = currentLang === 'ar' ? "📚 المصادر:" : "📚 Sources:";
            htmlContent += `<div class="sources"><h4>${sourcesTitle}</h4>`;
            groundingChunks.forEach(chunk => {
                if(chunk.web) {
                    htmlContent += `<a href="${chunk.web.uri}" target="_blank" rel="noopener noreferrer">${chunk.web.title || chunk.web.uri}</a>`;
                }
            });
            htmlContent += `</div>`;
        }

        resultContainer.innerHTML = htmlContent;
        addListenButton(resultContainer);
    } catch (error) {
        console.error("Knowledge base error:", error);
        showError(resultContainer, currentLang === 'ar' ? "حدث خطأ أثناء البحث." : "An error occurred during the search.");
    } finally {
        button.disabled = false;
    }
};

// --- TAB NAVIGATION ---
document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = (btn as HTMLElement).dataset.target;
        if (!targetId) return;

        document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
        document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
        
        btn.classList.add("active");
        const targetSection = document.getElementById(targetId);
        if(targetSection) {
            targetSection.classList.add("active");
            if (targetId === 'video') {
                setupVideoSection();
            }
        }
    });
});

// --- INITIALIZATION & EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', playClick);
    });

    document.getElementById('langBtn')?.addEventListener('click', toggleLang);
    document.getElementById('modeBtn')?.addEventListener('click', toggleMode);

    document.getElementById('generateImageBtn')?.addEventListener('click', () => generateImage('prompt', 'imgResult'));
    document.getElementById('generateCopticBtn')?.addEventListener('click', () => generateImage('copticPrompt', 'copticOut', 'Coptic icon in the traditional orthodox style, with golden leaf background, of'));
    document.getElementById('generateHymnBtn')?.addEventListener('click', () => generateTextContent('hymnText', 'hymnOut', 'You are a creative director. Based on these hymn lyrics, describe a 3-panel visual storyboard. For each panel, provide a title and a detailed visual description of the scene. Format it clearly.'));
    document.getElementById('generateScriptBtn')?.addEventListener('click', () => generateTextContent('scriptText', 'scriptOut', 'You are a screenwriter. Take the following scene idea and write it as a short screenplay scene. Include a scene heading (INT./EXT.), action lines, and dialogue if applicable. Format it professionally.'));
    document.getElementById('searchKnowledgeBtn')?.addEventListener('click', searchKnowledgeBase);

    // Initial setup for the video section if it's the default active tab
    if(document.querySelector('#video.active')) {
        setupVideoSection();
    }
});