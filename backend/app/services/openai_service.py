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
    response = client.chat.completions.create(
        model="gpt-3.5-turbo", messages=[{"role": "user", "content": prompt}])
    response_text = response.choices[0].message.content
    response_lines = response_text.strip().split("\n")

    score = 0
    feedback = ""
    suggestions = []

    for line in response_lines:
        if line.startswith("SCORE:"):
            try:
                score = int(line.split(":")[1].strip())
            except:
                score = 0
            break

    feedback_lines = []
    in_feedback = False
    for line in response_lines:
        if line.startswith("FEEDBACK:"):
            in_feedback = True
            continue
        if in_feedback:
            if line.startswith("SUGGESTIONS") or line.startswith("Improvements:"):
                break
            if line.strip():
                feedback_lines.append(line.strip())
    feedback = " ".join(feedback_lines)

    in_suggestions = False
    for line in response_lines:
        if "SUGGESTIONS" in line:
            in_suggestions = True
            continue
        if in_suggestions and line.strip():
            if line.strip()[0].isdigit():
                suggestion_text = line.strip().split(".", 1)
                if len(suggestion_text) > 1:
                    suggestions.append(suggestion_text[1].strip())
    result = {
        "overall_score": score,
        "analysis_text": feedback,
        "suggestions": suggestions
    }
    return result
