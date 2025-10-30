from openai import OpenAI
import os

def analyze_resume_with_ai(resume_text: str) -> dict:
    key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=key)

    prompt = f"""
        You are an expert resume reviewer and career coach. Analyze the following resume and provide:

        1. An overall score from 0-100 based on:
        - Formatting and readability
        - Content quality and relevance
        - Skills presentation
        - Experience descriptions
        - Grammar and professionalism

        2. Detailed feedback covering:
        - What the resume does well
        - What needs improvement
        - Missing elements

        3. Specific actionable suggestions for improvement

        Resume to analyze: {resume_text}

        Provide your response in this format:
        SCORE: [number 0-100]
        FEEDBACK: [your detailed analysis]
        SUGGESTIONS: [numbered list of improvements]
    """
    response = client.chat.completions.create(model="gpt-3.5-turbo", messages = [{"role": "user", "content": prompt}])
    response_text = response.choices[0].message.content
    response_lines = response_text.strip().split("\n")
    for lines in response_lines:
        if lines.startswith("SCORE:"):
            score = int(lines.split(":")[1].strip())
        if lines.startswith("FEEDBACK:"):
            feedback = lines.split(":")[1].strip()
        if lines.startswith("SUGGESTIONS:"):
            suggestions = lines.split(":")[1].strip()
    result = {
        "overall_score": score,
        "analysis_text": feedback,
        "suggestions": suggestions
    }
    return result


