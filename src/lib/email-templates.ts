const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export function buildEmailHtml(params: {
  label: string;
  title: string;
  bodyHtml: string;
  ctaText: string;
  ctaUrl: string;
  footerHtml: string;
}): string {
  const { label, title, bodyHtml, ctaText, ctaUrl, footerHtml } = params;
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;">
              <span style="font-size:20px;font-weight:700;color:#09090b;letter-spacing:-0.5px;">Loffy</span>
              <span style="font-size:20px;font-weight:400;color:#71717a;"> Tech Blog</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <!-- Body -->
                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0 0 6px;font-size:14px;color:#71717a;">${label}</p>
                    <h2 style="margin:0 0 24px;font-size:22px;font-weight:600;color:#09090b;line-height:1.3;">
                      ${title}
                    </h2>

                    ${bodyHtml}

                    <!-- CTA -->
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#09090b;border-radius:6px;">
                          <a href="${ctaUrl}" target="_blank"
                            style="display:inline-block;padding:10px 20px;font-size:14px;font-weight:500;color:#fafafa;text-decoration:none;">
                            ${ctaText} →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">
                ${footerHtml}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildReplyNotificationEmail(params: {
  recipientUsername: string;
  adminUsername: string;
  replyContent: string;
  originalContent: string;
  postTitle: string;
  postSlug: string;
}) {
  const postUrl = `${appUrl}/posts/${params.postSlug}`;
  const html = buildEmailHtml({
    label: "New reply",
    title: `${params.adminUsername} replied to your comment`,
    bodyHtml: `<p style="margin:0 0 24px;font-size:14px;color:#52525b;line-height:1.6;">
      Hi <strong style="color:#09090b;">${params.recipientUsername}</strong>, your comment on
      <a href="${postUrl}" style="color:#09090b;text-decoration:underline;">${params.postTitle}</a>
      received a reply.
    </p>`,
    ctaText: "View Discussion",
    ctaUrl: postUrl,
    footerHtml: `You received this because you commented on
      <a href="${postUrl}" style="color:#71717a;text-decoration:underline;">${params.postTitle}</a>.`,
  });

  return {
    subject: `${params.adminUsername} replied to your comment on "${params.postTitle}"`,
    html,
    text: `Hi ${params.recipientUsername},\n\n${params.adminUsername} replied to your comment on "${params.postTitle}".\n\nYour comment:\n${params.originalContent}\n\nReply:\n${params.replyContent}\n\nView the discussion: ${postUrl}`,
  };
}

export function buildForgotPasswordEmail(params: {
  email: string;
  resetUrl: string;
}) {
  const html = buildEmailHtml({
    label: "Password reset",
    title: "Reset your password",
    bodyHtml: `<p style="margin:0 0 24px;font-size:14px;color:#52525b;line-height:1.6;">
      We received a request to reset the password for your account (<strong style="color:#09090b;">${params.email}</strong>).
      Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
    </p>`,
    ctaText: "Reset Password",
    ctaUrl: params.resetUrl,
    footerHtml: "If you did not request this, you can safely ignore this email.",
  });

  return {
    subject: "Reset your password",
    html,
    text: `Reset your password: ${params.resetUrl}\n\nThis link expires in 1 hour. If you did not request this, you can safely ignore this email.`,
  };
}

export function buildMagicLinkEmail(params: {
  email: string;
  url: string;
  host: string;
}) {
  const html = buildEmailHtml({
    label: "Sign in",
    title: `Sign in to Loffy Tech Blog`,
    bodyHtml: `<p style="margin:0 0 24px;font-size:14px;color:#52525b;line-height:1.6;">
      Click the button below to sign in as <strong style="color:#09090b;">${params.email}</strong>.
      This link expires in <strong>24 hours</strong> and can only be used once.
    </p>`,
    ctaText: "Sign In",
    ctaUrl: params.url,
    footerHtml: "If you did not request this email, you can safely ignore it.",
  });

  return {
    subject: `Sign in to ${params.host}`,
    html,
    text: `Sign in to ${params.host}\n${params.url}\n\nIf you did not request this email, you can safely ignore it.`,
  };
}
