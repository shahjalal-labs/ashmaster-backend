import { Router } from "express";

const privacyPolicy = () => {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Bridge Connection — Privacy Policy</title>
<meta name="description" content="Privacy Policy for Bridge Connection mobile application"/>
<style>
:root{
--bg:#f7f8fb;
--card:#ffffff;
--text:#0f172a;
--muted:#6b7280;
--accent:#2563eb;
font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
}
body{margin:0;background:var(--bg);padding:32px;color:var(--text);}
.wrap{max-width:1000px;margin:0 auto;}
.card{background:var(--card);border-radius:12px;padding:28px;
box-shadow:0 6px 18px rgba(0,0,0,0.05);margin-bottom:20px;}
h1{font-size:24px;margin:0 0 8px;color:var(--accent);}
h2{font-size:18px;margin-top:32px;margin-bottom:12px;}
h3{font-size:16px;margin-top:24px;margin-bottom:8px;}
p,li{font-size:15px;line-height:1.7;}
ul{margin-left:22px;margin-bottom:16px;}
table{width:100%;border-collapse:collapse;margin-top:12px;font-size:14px;}
th,td{border:1px solid #e5e7eb;padding:10px 12px;text-align:left;vertical-align:top;}
th{background:#f1f5f9;font-weight:600;}
.muted{color:var(--muted);}
footer{text-align:center;margin-top:40px;font-size:13px;color:var(--muted);}
strong{font-weight:600;}
</style>
</head>
<body>
<div class="wrap">

<header class="card">
<h1>Bridge Connection Privacy Policy</h1>
<p class="muted"><strong>Effective Date:</strong> April 19, 2026</p>
</header>

<section class="card">

<h2>1. INTRODUCTION</h2>
<p>Bridge System LLC (“we,” “our,” or “us”) operates the Bridge app (the “Service”). This Privacy Policy explains how we collect, use, and protect your information when you use our app and website.</p>

<h2>2. INFORMATION WE COLLECT</h2>

<h3>Personal Information</h3>
<ul>
<li>Name, email address</li>
<li>Profile details (such as interests, job title, preferences)</li>
<li>Optional user-provided information</li>
</ul>

<h3>Usage Data</h3>
<ul>
<li>App activity and features used</li>
<li>Device information for analytics and performance</li>
</ul>

<h3>Communications</h3>
<ul>
<li>Messages exchanged between mentors and mentees</li>
<li>Encrypted during transmission</li>
<li>May be securely stored for delivery and legal compliance</li>
</ul>

<h2>3. HOW WE USE YOUR INFORMATION</h2>
<ul>
<li>Provide and personalize the mentorship experience</li>
<li>Facilitate communication between users</li>
<li>Maintain and improve functionality, security, and performance</li>
<li>Send updates, service notifications, and announcements</li>
<li>Comply with legal obligations</li>
</ul>

<h3>Example Data Usage</h3>
<table>
<thead>
<tr>
<th>Feature</th>
<th>Data Used</th>
<th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
<td>Account</td>
<td>Name, Email</td>
<td>User identification</td>
</tr>
<tr>
<td>Matching</td>
<td>Profile details</td>
<td>Mentor-mentee pairing</td>
</tr>
<tr>
<td>Messaging</td>
<td>Messages</td>
<td>Communication between users</td>
</tr>
</tbody>
</table>

<h2>4. DATA SHARING</h2>
<p>We do not sell your personal data. We may share information with trusted service providers (such as hosting and analytics providers) who assist in operating the Service. These providers are bound by confidentiality obligations.</p>

<h2>5. SECURITY</h2>
<p>We use encryption and modern data management practices to protect your information. However, no digital system is completely secure, and users share data at their own discretion.</p>

<h2>6. YOUR RIGHTS</h2>
<ul>
<li>Access your information</li>
<li>Update your data</li>
<li>Delete your account</li>
</ul>

<h3>Example Requests</h3>
<table>
<thead>
<tr>
<th>Request Type</th>
<th>Example</th>
</tr>
</thead>
<tbody>
<tr>
<td>Access</td>
<td>"Send me my data"</td>
</tr>
<tr>
<td>Deletion</td>
<td>"Delete my account"</td>
</tr>
<tr>
<td>Update</td>
<td>"Change my profile details"</td>
</tr>
</tbody>
</table>

<h2>7. CHILDREN'S PRIVACY</h2>
<p>The Service is intended for users aged 18 and older. We do not knowingly collect data from minors.</p>

<h2>8. CHANGES TO THIS POLICY</h2>
<p>We may update this Privacy Policy periodically. The latest version will always be available on our website.</p>

<h2>9. CONTACT US</h2>
<p>For questions about this Privacy Policy:</p>

<p><strong>Company:</strong> Bridge System LLC</p>
<p><strong>Email:</strong> customersupport@bridgesystemllc.com</p>
<p><strong>Website:</strong> https://www.bridgesystemllc.com</p>

</section>

<footer>
© 2026 Bridge System LLC — Privacy Policy
</footer>

</div>
</body>
</html>`;
};

const tapinTermsOfService = () => {
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Bridge Connection — Terms of Service</title>
<meta name="description" content="Terms of Service for Bridge Connection"/>
<style>
:root{
--bg:#f7f8fb;
--card:#ffffff;
--text:#0f172a;
--muted:#6b7280;
--accent:#2563eb;
font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
}
body{margin:0;background:var(--bg);padding:32px;color:var(--text);}
.wrap{max-width:1000px;margin:0 auto;}
.card{background:var(--card);border-radius:12px;padding:28px;
box-shadow:0 6px 18px rgba(0,0,0,0.05);margin-bottom:20px;}
h1{font-size:24px;margin:0 0 8px;color:var(--accent);}
h2{font-size:18px;margin-top:32px;margin-bottom:12px;}
h3{font-size:16px;margin-top:24px;margin-bottom:8px;}
p,li{font-size:15px;line-height:1.7;}
ul{margin-left:22px;margin-bottom:16px;}
table{width:100%;border-collapse:collapse;margin-top:12px;font-size:14px;}
th,td{border:1px solid #e5e7eb;padding:10px 12px;text-align:left;vertical-align:top;}
th{background:#f1f5f9;font-weight:600;}
.muted{color:var(--muted);}
footer{text-align:center;margin-top:40px;font-size:13px;color:var(--muted);}
strong{font-weight:600;}
</style>
</head>
<body>
<div class="wrap">

<header class="card">
<h1>Bridge Connection Terms of Service</h1>
<p class="muted"><strong>Version:</strong> 1.0</p>
<p class="muted"><strong>Last Updated:</strong> April 14, 2026</p>
<p class="muted"><strong>Effective Date:</strong> April 14, 2026</p>
</header>

<section class="card">

<h2>1. ACCEPTANCE OF TERMS</h2>
<p>By accessing or using Bridge Connection ("we," "our," or "us"), you agree to be bound by these Terms of Service. If you do not agree, you may not use our services.</p>

<h2>2. ELIGIBILITY</h2>
<ul>
<li>You must be at least 18 years old to use Bridge Connection</li>
<li>You must provide accurate and complete information</li>
<li>You are responsible for maintaining the security of your account</li>
</ul>

<h2>3. ACCOUNT RESPONSIBILITIES</h2>
<p>You agree to:</p>
<ul>
<li>Keep your login credentials secure</li>
<li>Notify us of unauthorized access</li>
<li>Be responsible for all activities under your account</li>
</ul>

<h2>4. USE OF SERVICES</h2>
<p>You agree to use Bridge Connection only for lawful purposes.</p>

<h3>Prohibited Activities</h3>
<ul>
<li>Harassment, abuse, or harmful behavior</li>
<li>Posting illegal, offensive, or misleading content</li>
<li>Attempting to hack, disrupt, or exploit the platform</li>
<li>Impersonating others</li>
<li>Using the service for unauthorized commercial purposes</li>
</ul>

<h3>Example Violations</h3>
<table>
<thead>
<tr>
<th>Action</th>
<th>Result</th>
</tr>
</thead>
<tbody>
<tr>
<td>Spamming users</td>
<td>Account suspension</td>
</tr>
<tr>
<td>Posting harmful content</td>
<td>Content removal / ban</td>
</tr>
<tr>
<td>Security attacks</td>
<td>Permanent account termination</td>
</tr>
</tbody>
</table>

<h2>5. USER CONTENT</h2>
<p>You retain ownership of content you submit, but you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content to operate the service.</p>

<p>You are responsible for ensuring your content does not violate laws or third-party rights.</p>

<h2>6. TERMINATION</h2>
<p>We may suspend or terminate your account if you violate these Terms or pose a risk to the platform or other users.</p>

<p>You may stop using our services at any time.</p>

<h2>7. PRIVACY</h2>
<p>Your use of Bridge Connection is also governed by our Privacy Policy.</p>

<h2>8. THIRD-PARTY SERVICES</h2>
<p>Our platform may include third-party services. We are not responsible for their content, policies, or practices.</p>

<h2>9. DISCLAIMERS</h2>
<p>Bridge Connection is provided "as is" and "as available." We do not guarantee uninterrupted or error-free service.</p>

<h2>10. LIMITATION OF LIABILITY</h2>
<p>To the maximum extent permitted by law, Bridge Connection shall not be liable for indirect, incidental, or consequential damages arising from your use of the service.</p>

<h2>11. INDEMNIFICATION</h2>
<p>You agree to indemnify and hold harmless Bridge System LLC from any claims, damages, or liabilities resulting from your use of the service or violation of these Terms.</p>

<h2>12. CHANGES TO TERMS</h2>
<p>We may update these Terms at any time. Continued use of the service constitutes acceptance of the updated Terms.</p>

<h2>13. GOVERNING LAW</h2>
<p>These Terms shall be governed by and interpreted under applicable laws, without regard to conflict of law principles.</p>

<h2>14. CONTACT</h2>
<p>If you have questions about these Terms:</p>

<p><strong>Email:</strong> customersupport@bridgesystemllc.com</p>

</section>

<footer>
© 2026 Bridge System LLC — Bridge Connection Terms of Service
</footer>

</div>
</body>
</html>
`;
};

const dataDelete = () => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Delete Data</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
    * {
      box-sizing: border-box;
    }
 
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f6f6;
      padding: 0;
      margin: 0;
    }
 
    .container {
      max-width: 400px;
      margin: 80px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
 
    h2 {
      color: #d32f2f;
      text-align: center;
      margin-bottom: 20px;
    }
 
    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
    }
 
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 10px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
    }
 
    button {
      width: 100%;
      padding: 12px;
      background-color: #d32f2f;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;
 
    }
 
    button:hover {
      background-color: #b71c1c;
    }
 
    .note {
      font-size: 13px;
      color: #555;
      text-align: center;
      margin-top: 15px;
    }
</style>
</head>
<body>
 
<div class="container">
<h2>Delete Your Data</h2>
  <form onsubmit="handleDelete(event)">
<label for="email">Email</label>
<input type="email" id="email" name="email" required>
    <label for="password">Password</label>
<input type="password" id="password" name="password" required>
    <button type="submit">Confirm</button>
</form>
 
  <div class="note">
    This action is irreversible. Please confirm carefully.
</div>
</div>
 
<script>
 
  function handleDelete(e) {
 
    e.preventDefault();
 
    const email = document.getElementById("email").value.trim();
 
    const password = document.getElementById("password").value.trim();
 
    if (!email || !password) {
 
      alert("Please fill in both fields.");
 
      return;
 
    }
 
    const confirmed = confirm(Are you sure you want to delete the account?);
 
    if (confirmed) {
 
      // TODO: Send deletion request to server here
 
      alert("Your account has been marked for deletion.");
 
    }
 
  }
</script>
 
</body>
</html>
 
 `;
};

const accountDelete = () => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Account Delete</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
    * {
      box-sizing: border-box;
    }
 
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f6f6;
      padding: 0;
      margin: 0;
    }
 
    .container {
      max-width: 400px;
      margin: 80px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
 
    h2 {
      color: #d32f2f;
      text-align: center;
      margin-bottom: 20px;
    }
 
    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
    }
 
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 10px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
    }
 
    button {
      width: 100%;
      padding: 12px;
      background-color: #d32f2f;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;
 
    }
 
    button:hover {
      background-color: #b71c1c;
    }
 
    .note {
      font-size: 13px;
      color: #555;
      text-align: center;
      margin-top: 15px;
    }
</style>
</head>
<body>
 
<div class="container">
<h2>Delete Your Account</h2>
  <form onsubmit="handleDelete(event)">
<label for="email">Email</label>
<input type="email" id="email" name="email" required>
    <label for="password">Password</label>
<input type="password" id="password" name="password" required>
    <button type="submit">Confirm</button>
</form>
 
  <div class="note">
    This action is irreversible. Please confirm carefully.
</div>
</div>
 
<script>
 
  function handleDelete(e) {
 
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }
 
    const confirmed = confirm(Are you sure you want to delete the account?);
    if (confirmed) {
      // TODO: Send deletion request to server here
      alert("Your account has been marked for deletion.");
    }
  }
</script>
</body>
</html>
 `;
};

const appStoreDescription = () => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>TapIn — App Store Description</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
    color: #1d1d1f;
    line-height: 1.6;
  }
  .container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  }
  h1 {
    color: #333; /* neutral dark gray */
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  .subtitle {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 2rem;
  }
  h2 {
    color: #333; /* neutral dark gray */
    font-size: 1.8rem;
    margin-top: 2rem;
    border-bottom: 2px solid #eee;
    padding-bottom: 0.5rem;
  }
  p, li {
    font-size: 1.05rem;
    margin: 0.8rem 0;
  }
  ul { padding-left: 1.8rem; }
  li::before {
    content: "•";
    color: #333; /* neutral bullet */
    display: inline-block;
    width: 1em;
    margin-left: -1em;
  }
  .legal-links {
    background-color: #f1f3f5;
    padding: 1.5rem;
    border-radius: 12px;
    margin-top: 2rem;
  }
  .legal-links a {
    color: #333; /* neutral link color */
    text-decoration: none;
    font-weight: 500;
  }
  .legal-links a:hover { text-decoration: underline; }
  .note {
    font-size: 0.95rem;
    color: #555;
    margin-top: 3rem;
    text-align: center;
  }
  pre {
    background: #f1f3f5;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .container { padding: 1.5rem; margin: 1rem; }
    h1 { font-size: 2rem; }
    .subtitle { font-size: 1rem; }
    h2 { font-size: 1.5rem; }
  }
  @media (max-width: 480px) {
    .container { padding: 1rem; margin: 0.8rem; }
    p, li { font-size: 1rem; }
    h1 { font-size: 1.6rem; }
    .subtitle { font-size: 0.95rem; }
  }
</style>
</head>
<body>
<div class="container">
  <h1>TapIn</h1>
  <div class="subtitle">
    The dating app designed to help you make real connections
  </div>

  <p>Whether you're looking for something serious or just exploring, TapIn makes it easy to discover, match, and chat with people near you.</p>

  <h2>Features</h2>
  <ul>
    <li>Smart Matching — Find compatible people based on your preferences</li>
    <li>Instant Chat — Message your matches in real time</li>
    <li>Profile Highlights — Showcase your personality with photos and prompts</li>
    <li>Safe & Secure — Your privacy is our priority</li>
  </ul>

  <h2>Subscription Plans</h2>
  <p>TapIn offers premium subscriptions to unlock all features:</p>
  <ul>
    <li>Weekly Plan — Auto-renews every week</li>
    <li>Monthly Plan — Auto-renews every month</li>
    <li>Annual Plan — Auto-renews every year</li>
  </ul>
  <p>Payment will be charged to your Apple ID account at confirmation of purchase. Subscription automatically renews unless canceled at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions via your App Store account settings.</p>

  <h2>Legal</h2>
  <div class="legal-links">
    <strong>Privacy Policy:</strong><br>
    <a href="https://api.tapinmobile.com/privacy-policy" target="_blank">https://api.tapinmobile.com/privacy-policy</a><br><br>
    <strong>Terms of Use (EULA):</strong><br>
    <a href="https://api.tapinmobile.com/terms-condition" target="_blank">https://api.tapinmobile.com/terms-condition</a>
  </div>

  <h2>End User License Agreement (EULA)</h2>
  <p><strong>Effective Date:</strong> March 17, 2026</p>
  <p>Please read this End User License Agreement ("Agreement") carefully before downloading or using TapIn ("App"). By using the App, you agree to be bound by the terms of this Agreement.</p>

  <h2>1. License</h2>
  <p>TapIn grants you a limited, non-exclusive, non-transferable, revocable license to use the App for personal, non-commercial purposes, strictly in accordance with the terms of this Agreement.</p>

  <h2>2. Auto-Renewable Subscriptions</h2>
  <ul>
    <li>Weekly Subscription — Auto-renews every 7 days</li>
    <li>Monthly Subscription — Auto-renews every 30 days</li>
    <li>Annual Subscription — Auto-renews every 365 days</li>
  </ul>
  <p>Payment will be charged to your Apple ID account at confirmation of purchase. Subscriptions automatically renew unless canceled at least 24 hours before the end of the current billing period. Your account will be charged for renewal within 24 hours prior to the end of the current period at the rate of your selected plan. You may manage or cancel your subscription at any time via App Store account settings. Cancellations take effect at the end of the current billing period. No refunds are provided for unused portions of any subscription term.</p>

  <h2>3. Restrictions</h2>
  <ul>
    <li>Copy, modify, or distribute the App or its content</li>
    <li>Reverse engineer or attempt to extract source code</li>
    <li>Use the App for any unlawful or harmful purpose</li>
    <li>Harass, abuse, or harm other users</li>
  </ul>

  <h2>4. User Content</h2>
  <p>You retain ownership of any content you submit. By submitting content, you grant TapIn a worldwide, royalty-free license to use, display, and distribute that content within the App. You are solely responsible for your content and conduct.</p>

  <h2>5. Privacy</h2>
  <p>Your use of the App is also governed by our Privacy Policy, which is incorporated into this Agreement by reference.</p>

  <h2>6. Termination</h2>
  <p>This Agreement is effective until terminated. TapIn may terminate your access to the App at any time if you violate any terms herein. Upon termination, you must cease all use of the App.</p>

  <h2>7. Disclaimer of Warranties</h2>
  <p>The App is provided "as is" without warranties of any kind. TapIn makes no guarantee that the App will be error-free, uninterrupted, or meet your specific requirements.</p>

  <h2>8. Limitation of Liability</h2>
  <p>To the fullest extent permitted by law, TapIn shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the App.</p>

  <h2>9. Governing Law</h2>
  <p>This Agreement shall be governed by and construed in accordance with applicable law. Any disputes shall be resolved in the competent courts of the applicable jurisdiction.</p>

  <h2>10. Contact</h2>
  <p>If you have any questions about this Agreement, please contact us:</p>
  <p>App: TapIn<br>
  Terms of Use: <a href="https://api.tapinmobile.com/terms-condition" target="_blank">https://api.tapinmobile.com/terms-condition</a></p>

  <div class="note">
    By using TapIn, you agree to our Terms of Use and Privacy Policy.
  </div>
</div>
</body>
</html>
`;
};

export const configRoutes = Router();

configRoutes.get("/privacy-policy", (_req, res) => {
  res.type("html").send(privacyPolicy());
});

configRoutes.get("/terms-condition", (_req, res) => {
  res.type("html").send(tapinTermsOfService());
});

configRoutes.get("/data-delete", (_req, res) => {
  res.type("html").send(dataDelete());
});

configRoutes.get("/account-delete", (_req, res) => {
  res.type("html").send(accountDelete());
});

configRoutes.get("/appstore-description", (_req, res) => {
  res.type("html").send(appStoreDescription());
});
