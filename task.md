# Task: Issue #34 — [Feature] Expand Certification & Academy Logo Dataset with Comprehensive AI Platforms & Model Academies

**Issue Link:** [GitHub #34](https://github.com/savewaris/PersonalWebsiteFullStack/issues/34)  
**Status:** In Progress  
**Started:** 2026-09-03T09:55:09.794Z

## 🎯 Objective
Expand the Universal Certification & Organization Logo Dataset (`src/lib/certification-logos.ts`) with a dedicated, extensive category of **AI platforms, LLM model academies, agent frameworks, and AI cloud/vector infrastructure**. This allows modern AI engineers to showcase verified credentials from cutting-edge frontier labs and developer bootcamps with brand-accurate vector logos and official brand colors.

---

## 📁 Target Scope
Not explicitly specified in issue body

## 📋 Technical Requirements
### Summary & Objective
Expand the Universal Certification & Organization Logo Dataset (`src/lib/certification-logos.ts`) with a dedicated, extensive category of **AI platforms, LLM model academies, agent frameworks, and AI cloud/vector infrastructure**. This allows modern AI engineers to showcase verified credentials from cutting-edge frontier labs and developer bootcamps with brand-accurate vector logos and official brand colors.

---

### Expanded AI Organization & Academy Matrix

1. **Frontier AI Labs & Developer Academies**:
   - **Anthropic / Claude**: `claude`, `anthropic`, `claude developer academy` (Brand color: `#D97757` / `#CC785C`).
   - **OpenAI Academy**: `openai`, `chatgpt`, `openai developers` (Brand color: `#10A37F`).
   - **Google DeepMind & AI Studio**: `deepmind`, `google-ai`, `gemini` (Brand color: `#4285F4`).
   - **Meta AI / PyTorch**: `meta-ai`, `pytorch`, `pytorch foundation` (Brand color: `#EE4C2C`).
   - **Mistral AI**: `mistral`, `mistral academy`, `la plateforme` (Brand color: `#FA520F`).
   - **Cohere**: `cohere`, `cohere llm university` (Brand color: `#39594C`).

2. **AI Agent Frameworks & Tooling**:
   - **LangChain Academy**: `langchain`, `langsmith`, `langgraph` (Brand color: `#1C3C3C`).
   - **LlamaIndex**: `llamaindex`, `llama-parse` (Brand color: `#7B2CBF`).
   - **Hugging Face Academy**: `huggingface`, `hf audio/nlp/diffusion course` (Brand color: `#FFD21E`).
   - **Weights & Biases (W&B)**: `wandb`, `weights & biases academy` (Brand color: `#FFBE00`).
   - **DeepLearning.AI**: `deeplearning`, `andrew ng` (Brand color: `#FF6F00`).
   - **fast.ai**: `fastai`, `practical deep learning` (Brand color: `#000000`).

3. **AI Compute, Data & Vector Infrastructure**:
   - **NVIDIA Deep Learning Institute (DLI)**: `nvidia`, `nvidia dli` (Brand color: `#76B900`).
   - **Pinecone Academy**: `pinecone`, `vector database certified` (Brand color: `#000000`).
   - **Qdrant**: `qdrant`, `vector search` (Brand color: `#DC2626`).
   - **Weaviate**: `weaviate`, `weaviate academy` (Brand color: `#00D2B4`).
   - **Databricks Generative AI**: `databricks-ai`, `databricks generative ai engineer` (Brand color: `#FF3621`).

---

### Technical Updates
- Update `src/lib/certification-logos.ts` with all new AI entries, aliases, and official domains.
- Update `src/lib/resolve-certification-logo.ts` with auto-matching regex patterns.
- Expand vector bindings in `src/components/PortfolioIcon.tsx` (`SiAnthropic`, `SiOpenai`, `SiPytorch`, `SiHuggingface`, etc.).

---

### Acceptance Criteria
- [ ] Curated AI category expanded with 15+ modern AI platforms and academies.
- [ ] Auto-resolver detects Claude/Anthropic, LangChain, LlamaIndex, W&B, and OpenAI credentials seamlessly.
- [ ] Visual Logo Picker modal (`LogoPickerModal.tsx`) renders the new AI academy logos with official brand colors.
- [ ] 0 TypeScript errors (`npx tsc --noEmit`) and successful production build (`npm run build`).


## ✅ Acceptance Criteria & Verification
- [ ] Curated AI category expanded with 15+ modern AI platforms and academies.
- [ ] Auto-resolver detects Claude/Anthropic, LangChain, LlamaIndex, W&B, and OpenAI credentials seamlessly.
- [ ] Visual Logo Picker modal (`LogoPickerModal.tsx`) renders the new AI academy logos with official brand colors.
- [ ] 0 TypeScript errors (`npx tsc --noEmit`) and successful production build (`npm run build`).
