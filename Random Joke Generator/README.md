# 😂 Random Joke Generator (AWS Cloud Project)

A beginner-friendly AWS Cloud project that demonstrates how to integrate **API Gateway**, **Lambda**, and a **Frontend Website** to fetch and display random jokes from a public API.

---

## 📌 Project Overview

The **Random Joke Generator** is a simple full-stack cloud project that:

- Uses **AWS Lambda** as a backend function.
- Fetches jokes from the public API: [`https://official-joke-api.appspot.com`](https://official-joke-api.appspot.com).
- Exposes the Lambda function via **Amazon API Gateway** (`GET /joke` endpoint).
- Displays the joke on a **frontend web page** (HTML, CSS, JavaScript).
- Teaches **CORS configuration**, **API Gateway integration**, and **Lambda proxying**.

---


## 📝 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [AWS Services Used](#aws-services-used)
- [Prerequisites](#prerequisites)
- [Deployment Steps](#deployment-steps)
- [Usage](#usage)
- [Future Improvements](#future-improvements)

---
## 🏗️ Architecture

<img width="1536" height="1024" alt="Architectural Diagram" src="https://github.com/user-attachments/assets/a93b6efb-0026-4f13-a7d8-51e62bc3c8f8" />

---
⚡ How It Works

1. A user clicks Get Joke on the frontend.

2. The frontend calls the API Gateway endpoint.

3. API Gateway triggers the Lambda function.

4. Lambda returns a random joke as JSON.

5. The frontend displays the joke instantly.
---
🌟 Features

+ Serverless architecture (no servers to manage).

+ Beginner-friendly AWS integration.

+ Fully documented workflow.

+ Extendable to other APIs (facts, quotes, trivia).

## 🔧 AWS Setup Instructions

Step 1️⃣  
+ Create the IAM role for Lambda
  Sign in to the AWS Management Console.
Open IAM → Roles → Create role.
Trusted entity type: AWS service.
Use case: Choose Lambda → Next.
Permissions: Search and attach AWSLambdaBasicExecutionRole
(This lets Lambda write logs to CloudWatch).
Role name: lambda-joke-role → Create role.
--
Step 2 — 
Create the Lambda function (Node.js 20)
Go to AWS Lambda → Create function.
Author from scratch:
Function name: random-joke-lambda
Runtime: Node.js 20.x
Architecture: x86_64 (default is fine)
Change default execution role: Use an existing role → select lambda-joke-role
Click Create function.
Add the code
In the code editor (index.mjs or index.js area), replace the contents with:




