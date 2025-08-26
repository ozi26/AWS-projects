# :sun_behind_rain_cloud: Weather & Time Dashboard ⏰

**Full-stack Cloud Project** – Built on **AWS Lambda + API Gateway + S3** with **HTML/JavaScript frontend**.  
Shows **current weather** and **local time** for any user-input city by securely consuming **OpenWeather API** and **TimeZoneDB API**. 


#  Overview
The **Weather & Time Dashboard** is a cloud-powered web app where a user types a city (and optional country code) into a simple HTML form, and the app displays:

- 🌡️ **Current Weather** – temperature, humidity, feels-like, description, icon.  
- 🕒 **Local Time** – accurate time zone-based time for the city.  

This project integrates **AWS services** with **external REST APIs**, demonstrating **serverless backend development, frontend integration, API Gateway query parameters, CORS, and environment variable management**.

# Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [AWS Setup Instructions](#aws-setup-instructions)
- [Author](#author)

# Architecture

<img width="1536" height="1024" alt="weather and time dashboard" src="https://github.com/user-attachments/assets/89798688-078a-496a-b641-514bc8582adf" />

---
# Features
- **User input form** → Enter city + optional 2-letter country code.
   
- **Dynamic results** → Weather + local time displayed with icons.
   
- **CORS enabled** → Secure browser-to-API communication.
  
- **Environment variables** → API keys are kept safe on the backend.
    
- **Responsive design** → Works on desktop & mobile.
   
- **Serverless backend** → No servers to manage, auto-scaling with AWS Lambda. 

# Technologies Used

+ **Cloud / Backend**
   - AWS Lambda – Serverless compute for API logic  
   - Amazon API Gateway – REST endpoint with query parameters + CORS  
   - Amazon S3 – (optional) static website hosting for the frontend  
   - CloudWatch Logs – Debugging and monitoring Lambda  

+ **Frontend**
   - HTML5, CSS3, Vanilla JavaScript  
   - Responsive, minimal UI  

+ **External APIs**
   - OpenWeather – Current weather data (free tier)  
   - TimeZoneDB – Local time by latitude/longitude  

# Prerequisites
   + An AWS account (free tier is fine).
     
   + A modern browser (Chrome/Edge/Firefox).
     
   + (Optional) VS Code to edit files comfortably.
     
   > Note: Windows Operating System

   + External APIs**
     
      > Example: [OpenWeather](https://openweathermap.org/api)

      > Example: [TimeZoneDB](https://timezonedb.com/api)

   

#  AWS Setup Instructions
Step 1️⃣ 
+ Create the IAM role for Lambda
  + `IAM` → `Roles` → Create role.
  + Trusted entity type: AWS service.
  + Use case: Choose Lambda → Next.
  + Permissions: Search and attach `AWSLambdaBasicExecutionRole`.
    (This lets Lambda write logs to CloudWatch).
  + Role name: `lambda-basic-logs-role `
  + Create role.
---
Step 2️⃣
+ Create the Lambda Function**
   - Runtime: **Node.js 20.x**  
   - Role: Attach **AWSLambdaBasicExecutionRole** (CloudWatch Logs access)  
   - Add **Environment Variables**:  
  - `OPENWEATHER_API_KEY` = *your OpenWeather key*  
  - `TIMEZONEDB_API_KEY` = *your TimeZoneDB key*  

+ **3. Deploy Backend**
   - Paste Lambda code into the function editor.  
   - Deploy and test using AWS Console test event(optional):
  
  ```json
  {
    "version": "2.0",
    "routeKey": "GET /weather-time",
    "queryStringParameters": { "city": "Lagos", "country": "NG" },
    "requestContext": { "http": { "method": "GET", "path": "/weather-time" } }
  }

+ Increase Lambda timeout
  
  + Configuration → General configuration → Edit:
  + Timeout: set to `10` seconds → Save.

---
Step 3️⃣
+ Create the API Gateway HTTP API.
   + Choose HTTP API → Click Build.
   + Configure:
      + Name: `weather-timeAPI`
     
+ Add an integration
   + Integration target: Lambda Function
   + Select your lambda function.

+ Routes: Add route
   + Method: `GET`
   + Resource path: `/weather-time`
   + Integration: **your Lambda function**.
   
+ CORS:
  
   + In CORS settings, Enable CORS.
   + Allow origins: `*`
     
   > (for dev; later restrict to your website origin).
      
   + Allow methods: `GET`
   + Allow headers: `Content-Type`

   > Deployments: Ensure Auto-deploy is enabled (HTTP APIs usually auto-deploy).

   > Note the Invoke URL, e.g. https://abc123.execute-api.us-east-1.amazonaws.com.
    
---
Step 4️⃣  

+ Frontend (HTML/CSS/JS).  Create a new file on your PC: `index.html` (any folder). 
      
   > Update the `API_BASE_URL` value to your `API invoke URL`.

   > No external libraries needed; it’s pure HTML/CSS/JS.

+ Host your frontend (optional)
   + S3 → Create bucket
   + Name: `weather-time-<your-unique-suffix>`
   + Region: your choice
   + Uncheck “Block all public access” (only for this learning exercise) → acknowledge.
   + Enable Static website hosting → Hosting type: Enable → Index document: index.html → Save.
   + Upload index.html to the bucket.

 + Bucket policy Permissions (allow public read of objects):
   ```json
    {
     "Version": "2012-10-17",
     "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::weather-time-<your-unique-suffix>/*"
    }]
   }

+ Visit the Static website endpoint shown in the bucket’s Properties.

    > CORS: For this project, CORS must be enabled on API Gateway (we did). S3 doesn’t need special CORS for serving a single page.

#  Author

Praise Ossai-Chidi

AWS Certified | Cloud & DevOps Enthusiast 




