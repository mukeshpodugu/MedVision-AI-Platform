import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from ..core.config import settings

class ReportService:
    @staticmethod
    def generate_pdf_report(prediction_data: dict, patient_data: dict, image_path: str, gradcam_path: str = None) -> str:
        """
        Generates a professional, print-ready PDF report for a patient scan prediction.
        Embeds the original scan, prediction details, confidence score, detailed findings,
        and developer details.
        """
        report_filename = f"report_{prediction_data['id']}.pdf"
        report_dest = os.path.join(settings.UPLOAD_DIR, "reports", report_filename)
        os.makedirs(os.path.dirname(report_dest), exist_ok=True)
        
        doc = SimpleDocTemplate(
            report_dest,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=50
        )
        
        styles = getSampleStyleSheet()
        
        # Define Custom Styles
        primary_color = colors.HexColor("#0f172a") # Slate 900
        secondary_color = colors.HexColor("#0284c7") # Sky 600
        accent_color = colors.HexColor("#f1f5f9") # Slate 100
        text_color = colors.HexColor("#334155") # Slate 700
        
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=24,
            textColor=primary_color,
            spaceAfter=6
        )
        
        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            textColor=secondary_color,
            spaceAfter=20
        )
        
        section_heading = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=14,
            textColor=primary_color,
            spaceBefore=12,
            spaceAfter=8,
            borderPadding=4
        )
        
        body_style = ParagraphStyle(
            'ReportBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            textColor=text_color,
            leading=14
        )
        
        bold_body_style = ParagraphStyle(
            'ReportBoldBody',
            parent=body_style,
            fontName='Helvetica-Bold'
        )
        
        findings_style = ParagraphStyle(
            'ReportFindings',
            parent=body_style,
            fontName='Helvetica-Oblique',
            fontSize=11,
            leading=16,
            textColor=colors.HexColor("#1e293b")
        )
        
        footer_style = ParagraphStyle(
            'ReportFooter',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=8,
            textColor=colors.HexColor("#64748b"),
            alignment=1 # Center
        )

        story = []
        
        # 1. Header (Logo / Title Block)
        story.append(Paragraph("MEDVISION AI", title_style))
        story.append(Paragraph("Intelligent Disease Detection & Health Analytics Platform", subtitle_style))
        
        # Horizontal Rule
        hr_table = Table([[""]], colWidths=[530])
        hr_table.setStyle(TableStyle([
            ('LINEBELOW', (0,0), (-1,-1), 2, secondary_color),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(hr_table)
        story.append(Spacer(1, 15))
        
        # 2. Patient & Report Metadata (Table Layout)
        meta_data = [
            [
                Paragraph("<b>Patient Information</b>", bold_body_style), 
                Paragraph("<b>Diagnosis Details</b>", bold_body_style)
            ],
            [
                Paragraph(f"Name: {patient_data['name']}", body_style),
                Paragraph(f"Category: {prediction_data['category'].replace('_', ' ').title()}", body_style)
            ],
            [
                Paragraph(f"Age / Gender: {patient_data['age']} yrs / {patient_data['gender']}", body_style),
                Paragraph(f"Model Used: {prediction_data['model_name']}", body_style)
            ],
            [
                Paragraph(f"Patient ID: PAT-{patient_data['id']}", body_style),
                Paragraph(f"Prediction Date: {datetime.strptime(prediction_data['created_at'], '%Y-%m-%dT%H:%M:%S.%f').strftime('%b %d, %Y %I:%M %p') if isinstance(prediction_data['created_at'], str) else prediction_data['created_at'].strftime('%b %d, %Y %I:%M %p')}", body_style)
            ]
        ]
        
        meta_table = Table(meta_data, colWidths=[265, 265])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), accent_color),
            ('PADDING', (0,0), (-1,-1), 6),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 20))
        
        # 3. AI Prediction Results
        story.append(Paragraph("Diagnostic Classification", section_heading))
        
        confidence_pct = f"{prediction_data['confidence'] * 100:.1f}%"
        result_data = [
            [
                Paragraph("Predicted Diagnosis:", bold_body_style),
                Paragraph(f"<font color='#0284c7'><b>{prediction_data['predicted_class']}</b></font>", bold_body_style)
            ],
            [
                Paragraph("Confidence Score:", bold_body_style),
                Paragraph(f"<b>{confidence_pct}</b>", bold_body_style)
            ]
        ]
        result_table = Table(result_data, colWidths=[150, 380])
        result_table.setStyle(TableStyle([
            ('PADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('TOPPADDING', (0,0), (-1,-1), 2),
        ]))
        story.append(result_table)
        story.append(Spacer(1, 15))
        
        # 4. Clinical Findings / AI Interpretation
        story.append(Paragraph("AI Interpretative Findings", section_heading))
        findings_box = Table([[Paragraph(prediction_data['findings'], findings_style)]], colWidths=[530])
        findings_box.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
            ('PADDING', (0,0), (-1,-1), 12),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e2e8f0")),
        ]))
        story.append(findings_box)
        story.append(Spacer(1, 20))
        
        # 5. Visual Scans Section (Original Scan & Grad-CAM side-by-side if exists)
        story.append(Paragraph("Medical Imaging & Explainability (Grad-CAM)", section_heading))
        
        # Resolve paths
        scan_img_path = image_path
        explain_img_path = gradcam_path if gradcam_path else image_path
        
        # Convert relative paths to absolute paths
        if scan_img_path.startswith("/uploads"):
            scan_img_path = os.path.join(os.path.dirname(settings.UPLOAD_DIR), scan_img_path.lstrip("/"))
        if explain_img_path.startswith("/uploads"):
            explain_img_path = os.path.join(os.path.dirname(settings.UPLOAD_DIR), explain_img_path.lstrip("/"))
            
        image_row = []
        # Check if files exist, resize for PDF
        if os.path.exists(scan_img_path):
            try:
                img_w = 2.4 * inch
                img_h = 2.4 * inch
                rl_scan = RLImage(scan_img_path, width=img_w, height=img_h)
                image_row.append(rl_scan)
            except Exception as e:
                image_row.append(Paragraph(f"Error loading scan image: {e}", body_style))
        else:
            image_row.append(Paragraph("Scan image not found.", body_style))
            
        if os.path.exists(explain_img_path):
            try:
                img_w = 2.4 * inch
                img_h = 2.4 * inch
                rl_explain = RLImage(explain_img_path, width=img_w, height=img_h)
                image_row.append(rl_explain)
            except Exception as e:
                image_row.append(Paragraph(f"Error loading Grad-CAM image: {e}", body_style))
        else:
            image_row.append(Paragraph("Grad-CAM visualization not available.", body_style))
            
        images_table_data = [
            [Paragraph("<b>Original Uploaded Scan</b>", bold_body_style), Paragraph("<b>AI Grad-CAM Localization</b>", bold_body_style)],
            image_row
        ]
        
        images_table = Table(images_table_data, colWidths=[265, 265])
        images_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('PADDING', (0,0), (-1,-1), 8),
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ]))
        story.append(images_table)
        story.append(Spacer(1, 30))
        
        # 6. Disclaimer & Developer Info
        disclaimer_text = (
            "<b>Disclaimer:</b> MedVision AI is an AI-assisted diagnostic helper tool. All predictions "
            "and findings are generated automatically using deep learning algorithms. They are intended "
            "solely for clinical decision support and should be verified by a board-certified medical professional."
        )
        story.append(Paragraph(disclaimer_text, ParagraphStyle('Disclaimer', parent=body_style, fontSize=8, leading=11, textColor=colors.HexColor("#94a3b8"))))
        story.append(Spacer(1, 10))
        
        # Developer footer details
        dev_text = (
            f"Developer: <b>{settings.DEVELOPER_NAME}</b> &nbsp;|&nbsp; "
            f"Email: {settings.DEVELOPER_EMAIL} &nbsp;|&nbsp; "
            f"Phone: {settings.DEVELOPER_PHONE} &nbsp;|&nbsp; "
            f"Location: {settings.DEVELOPER_LOCATION}"
        )
        story.append(Paragraph(dev_text, footer_style))
        
        # Build Document
        doc.build(story)
        
        return f"/uploads/reports/{report_filename}"
