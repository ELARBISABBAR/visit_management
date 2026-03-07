<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Annulation de visite</title>
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f3ef; font-family: 'DM Sans', Helvetica, Arial, sans-serif;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f3ef; padding: 48px 24px;">
    <tr>
        <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">

                <!-- Header — uses a muted red-brown tone to signal cancellation -->
                <tr>
                    <td style="background-color: #2c1a1a; padding: 36px 48px 32px;">
                        <p style="margin: 0 0 28px 0; font-family: 'DM Sans', Helvetica, sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: #9c8a8a;">
                            Système de gestion des visites
                        </p>
                        <h1 style="margin: 0; font-family: 'EB Garamond', Georgia, serif; font-size: 32px; font-weight: 400; line-height: 1.2; color: #f4f3ef; letter-spacing: -0.5px;">
                            Annulation<br>de visite
                        </h1>
                        <div style="margin-top: 24px; width: 40px; height: 2px; background-color: #b86a6a;"></div>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="background-color: #ffffff; padding: 48px;">

                        <p style="margin: 0 0 36px 0; font-size: 14px; font-weight: 300; line-height: 1.7; color: #5a5a52;">
                            La visite planifiée ci-dessous a été annulée. Aucune action n'est requise de votre part.
                        </p>

                        <!-- Divider -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 36px;">
                            <tr><td style="border-top: 1px solid #e8e6df;"></td></tr>
                        </table>

                        <!-- Visitor Name (featured) -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                                <td style="padding-bottom: 32px;">
                                    <p style="margin: 0 0 6px 0; font-size: 10px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; color: #9c9a8e;">Visiteur</p>
                                    <p style="margin: 0; font-family: 'EB Garamond', Georgia, serif; font-size: 26px; font-weight: 400; color: #1a1a18; letter-spacing: -0.3px;">{{ $visit->visitor_name }}</p>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">

                                        <!-- Row 1 -->
                                        <tr>
                                            <td width="50%" style="padding-right: 16px; padding-bottom: 24px; vertical-align: top; border-top: 1px solid #e8e6df; padding-top: 20px;">
                                                <p style="margin: 0 0 5px 0; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: #9c9a8e;">Type de visiteur</p>
                                                <p style="margin: 0; font-size: 14px; font-weight: 400; color: #1a1a18;">{{ $visit->visitor_type }}</p>
                                            </td>
                                            <td width="50%" style="padding-left: 16px; padding-bottom: 24px; vertical-align: top; border-top: 1px solid #e8e6df; padding-top: 20px;">
                                                <p style="margin: 0 0 5px 0; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: #9c9a8e;">Société</p>
                                                <p style="margin: 0; font-size: 14px; font-weight: 400; color: #1a1a18;">{{ $visit->company ?: '—' }}</p>
                                            </td>
                                        </tr>

                                        <!-- Row 2 -->
                                        <tr>
                                            <td width="50%" style="padding-right: 16px; padding-bottom: 24px; vertical-align: top; border-top: 1px solid #e8e6df; padding-top: 20px;">
                                                <p style="margin: 0 0 5px 0; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: #9c9a8e;">Département</p>
                                                <p style="margin: 0; font-size: 14px; font-weight: 400; color: #1a1a18;">{{ $visit->department?->name ?: '—' }}</p>
                                            </td>
                                            <td width="50%" style="padding-left: 16px; padding-bottom: 24px; vertical-align: top; border-top: 1px solid #e8e6df; padding-top: 20px;">
                                                <p style="margin: 0 0 5px 0; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: #9c9a8e;">Date / heure prévues</p>
                                                <p style="margin: 0; font-size: 14px; font-weight: 400; color: #1a1a18;">{{ optional($visit->scheduled_at)?->format('d/m/Y') }}</p>
                                                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 300; color: #5a5a52;">{{ optional($visit->scheduled_at)?->format('H:i') }}</p>
                                            </td>
                                        </tr>

                                    </table>
                                </td>
                            </tr>
                        </table>

                        <!-- Cancellation notice -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 36px;">
                            <tr>
                                <td style="background-color: #fdf6f6; border-left: 3px solid #b86a6a; padding: 16px 20px;">
                                    <p style="margin: 0; font-size: 12px; font-weight: 400; color: #7a3a3a; line-height: 1.6;">
                                        Cette visite a été annulée et ne figurera plus dans le registre des visites actives.
                                    </p>
                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background-color: #f4f3ef; padding: 24px 48px; border-top: 1px solid #e8e6df;">
                        <p style="margin: 0; font-size: 11px; font-weight: 300; color: #9c9a8e; line-height: 1.6;">
                            Ce message est généré automatiquement par le système de gestion des visites. Merci de ne pas y répondre directement.
                        </p>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>