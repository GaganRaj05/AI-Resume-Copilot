const email_templates = {
  onboarding: {
    html: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />

  <title>Welcome to AgentCV</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f7fa;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif;
      color: #111827;
    }

    table {
      border-spacing: 0;
      border-collapse: collapse;
    }

    img {
      border: 0;
      display: block;
      max-width: 100%;
    }

    .wrapper {
      width: 100%;
      background-color: #f5f7fa;
      padding: 40px 16px;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
    }

    .header {
      padding: 32px 40px 24px;
      text-align: left;
    }

    .logo {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #111827;
    }

    .logo-accent {
      color: #6366f1;
    }

    .content {
      padding: 16px 40px 40px;
    }

    .eyebrow {
      display: inline-block;
      margin-bottom: 16px;
      padding: 6px 10px;
      background: #eef2ff;
      color: #4f46e5;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }

    h1 {
      margin: 0 0 18px;
      font-size: 34px;
      line-height: 1.15;
      letter-spacing: -1.2px;
      color: #111827;
    }

    .intro {
      margin: 0 0 28px;
      font-size: 16px;
      line-height: 1.7;
      color: #4b5563;
    }

    .highlight {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 22px;
      margin: 0 0 28px;
    }

    .highlight-title {
      margin: 0 0 8px;
      font-size: 15px;
      font-weight: 700;
      color: #111827;
    }

    .highlight-text {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: #6b7280;
    }

    .features {
      margin: 0 0 30px;
    }

    .feature {

    }

    .feature-icon {
      width: 32px;
      height: 20px;
      background: #eef2ff;
      border-radius: 8px;
      text-align: center;
      vertical-align: middle;
      font-size: 15px;
      line-height: 32px;
    }

    .feature-content {
      padding-left: 12px;
      vertical-align: middle;
    }

    .feature-title {
      margin: 0 0 3px;
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }

    .feature-description {
      margin: 0;
      font-size: 13px;
      line-height: 1.5;
      color: #6b7280;
    }

    .closing {
      margin: 0;
      font-size: 15px;
      line-height: 1.7;
      color: #4b5563;
    }

    .signature {
      margin-top: 26px;
      font-size: 14px;
      line-height: 1.6;
      color: #4b5563;
    }

    .signature strong {
      color: #111827;
    }

    .footer {
      border-top: 1px solid #e5e7eb;
      padding: 24px 40px;
      text-align: center;
    }

    .footer-text {
      margin: 0;
      font-size: 12px;
      line-height: 1.6;
      color: #9ca3af;
    }

    @media only screen and (max-width: 600px) {
      .wrapper {
        padding: 20px 12px;
      }

      .header {
        padding: 26px 24px 20px;
      }

      .content {
        padding: 12px 24px 32px;
      }

      .footer {
        padding: 20px 24px;
      }

      h1 {
        font-size: 29px;
      }
    }
  </style>
</head>

<body>
  <table role="presentation" width="100%" class="wrapper">
    <tr>
      <td align="center">

        <table
          role="presentation"
          class="container"
          width="100%"
          cellpadding="0"
          cellspacing="0"
        >

          <!-- Header -->
          <tr>
            <td class="header">
              <div class="logo">
                AGENT<span class="logo-accent">CV</span>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content">

              <div class="eyebrow">You're on the list</div>

              <h1>
                Your next career move<br />
                just got a little easier.
              </h1>
              
              <p class="intro">
                Hi, Thanks for joining the AgentCV waitlist.
                We're building a smarter way to create, improve, and
                tailor your resume, without spending hours trying to
                figure out what recruiters actually want to see.
              </p>

              <div class="highlight">
                <p class="highlight-title">
                  You're officially on the waitlist.
                </p>

                <p class="highlight-text">
                  We'll keep you posted as AgentCV gets closer
                  to launch. Early users will be among the first to
                  experience what we're building.
                </p>
              </div>

              <!-- Features -->
              <table
                role="presentation"
                width="100%"
                class="features"
              >
                <tr class="feature">
                  <td class="feature-icon">✦</td>
                  <td class="feature-content">
                    <p class="feature-title">
                      Smarter resume feedback
                    </p>
                    <p class="feature-description">
                      Understand what's holding your resume back
                      and how to improve it.
                    </p>
                  </td>
                </tr>

                <tr class="feature">
                  <td class="feature-icon">↗</td>
                  <td class="feature-content">
                    <p class="feature-title">
                      Tailored for the role
                    </p>
                    <p class="feature-description">
                      Align your experience with the opportunities
                      you're actually applying for.
                    </p>
                  </td>
                </tr>

                <tr class="feature">
                  <td class="feature-icon">◎</td>
                  <td class="feature-content">
                    <p class="feature-title">
                      Less guesswork
                    </p>
                    <p class="feature-description">
                      Turn your experience into a resume that tells
                      your story clearly and effectively.
                    </p>
                  </td>
                </tr>
              </table>

              <p class="closing">
                We're excited to have you with us from the beginning.
                We'll be in touch when there's something worth sharing.
              </p>

              <div class="signature">
                <strong>The AgentCV Team</strong><br />
                Build a resume that gets noticed.
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              <p class="footer-text">
                You received this email because you joined the
                AgentCV waitlist.<br />
                © 2026 AgentCV. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
        `,
  },
};

module.exports = email_templates;
