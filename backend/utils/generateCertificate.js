const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Ensure certificates directory exists
const certificatesDir = path.join(__dirname, "../certificates");
if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir, { recursive: true });
}

const generateCertificate = (studentName, courseName, completionDate = new Date()) => {
    return new Promise((resolve, reject) => {
        try {
            const filename = `${studentName.replace(/\s+/g, "_")}_${courseName.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
            const filePath = path.join(certificatesDir, filename);

            const doc = new PDFDocument({
                size: "A4",
                margin: 50,
            });

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Background color
            doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f0f4f8");

            // Border
            doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
                .lineWidth(3)
                .stroke("#1e40af");

            // Decorative border inner
            doc.rect(45, 45, doc.page.width - 90, doc.page.height - 90)
                .lineWidth(1)
                .stroke("#3b82f6");

            // Title
            doc.fontSize(48)
                .font("Helvetica-Bold")
                .fillColor("#1e40af")
                .text("Certificate", 0, 100, {
                    align: "center",
                })
                .fontSize(36)
                .fillColor("#2563eb")
                .text("of Completion", 0, 160, {
                    align: "center",
                });

            // Decorative line
            doc.moveTo(150, 220).lineTo(doc.page.width - 150, 220).stroke("#3b82f6");

            // Body text
            doc.fontSize(18)
                .font("Helvetica")
                .fillColor("#000000")
                .text("This is proudly presented to", 0, 280, {
                    align: "center",
                });

            // Student name (prominent)
            doc.fontSize(32)
                .font("Helvetica-Bold")
                .fillColor("#1e40af")
                .text(studentName, 0, 320, {
                    align: "center",
                });

            // Decorative underline under name
            doc.moveTo(100, 365)
                .lineTo(doc.page.width - 100, 365)
                .lineWidth(2)
                .stroke("#3b82f6");

            // Achievement text
            doc.fontSize(14)
                .font("Helvetica")
                .fillColor("#374151")
                .text("For successfully completing the course", 0, 400, {
                    align: "center",
                });

            // Course name (prominent)
            doc.fontSize(26)
                .font("Helvetica-Bold")
                .fillColor("#2563eb")
                .text(`"${courseName}"`, 0, 440, {
                    align: "center",
                });

            // Additional text
            doc.fontSize(12)
                .font("Helvetica")
                .fillColor("#4b5563")
                .text("Demonstrating commitment to continuous learning and professional development.", 100, 520, {
                    width: doc.page.width - 200,
                    align: "center",
                });

            // Date and signature area
            doc.fontSize(11)
                .fillColor("#000000")
                .text("Date of Completion:", 100, 600);

            doc.fontSize(14)
                .font("Helvetica-Bold")
                .text(completionDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }), 100, 620);

            // Signature line
            doc.fontSize(11).font("Helvetica").text("Authorized Signature", doc.page.width - 250, 600);
            doc.moveTo(doc.page.width - 250, 645).lineTo(doc.page.width - 80, 645).stroke();

            // Footer
            doc.fontSize(10)
                .fillColor("#6b7280")
                .text(
                    "This certificate is awarded in recognition of dedication and successful course completion.",
                    0,
                    doc.page.height - 60,
                    { align: "center" }
                );

            doc.end();

            stream.on("finish", () => {
                console.log("✅ Certificate generated:", filename);
                resolve({ filename, filePath });
            });

            stream.on("error", (err) => {
                console.error("❌ Certificate generation error:", err);
                reject(err);
            });
        } catch (error) {
            console.error("❌ Certificate generation failed:", error);
            reject(error);
        }
    });
};

module.exports = { generateCertificate };
