from openai import OpenAI
import os


def generate_cover_letter_with_ai(resume_text: str, job_title: str, company_name: str, job_description: str) -> str:
    key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=key)

    prompt = f"""
        You are an expert career coach and professional cover letter writer with years of experience helping candidates land their dream jobs.

        Write a compelling, personalized cover letter for the following position:
        - Job Title: {job_title}
        - Company: {company_name}

        CANDIDATE'S RESUME:
        {resume_text}

        JOB DESCRIPTION:
        {job_description}

        REQUIREMENTS:
        1. Match the candidate's relevant skills and experiences from their resume to the specific requirements in the job description
        2. Highlight 2-3 key achievements that directly relate to the role
        3. Show genuine enthusiasm for the company and position
        4. Demonstrate understanding of the company's mission/values (inferred from job description)
        5. Be professional yet personable - avoid clichés and generic phrases
        6. Keep the letter concise: 3-4 paragraphs, approximately 250-350 words
        7. Use a confident but humble tone
        8. Include specific examples rather than vague statements

        FORMAT:
        - Start with: "Dear Hiring Manager,"
        - Body: 3-4 well-structured paragraphs
        - End with: "Sincerely," (no signature name - let the user add it)
        - Do NOT include [Candidate Name], [Address], or [Date] - only the letter body

        STRUCTURE:
        - Paragraph 1: Express interest and briefly mention how you learned about the position
        - Paragraph 2-3: Highlight relevant skills/experiences that match the job requirements with specific examples
        - Paragraph 4: Express enthusiasm, mention availability for interview, and thank them

        Return ONLY the cover letter text, ready to use. No additional commentary or explanations.
    """
    response = client.chat.completions.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": prompt}])
    cover_letter_text = response.choices[0].message.content
    return cover_letter_text

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
