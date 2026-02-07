import { Container, Typography } from "@mui/material";

export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-auto">
            <Container maxWidth="lg">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} SkillNet. All rights reserved.
                    </Typography>
                    <div className="flex gap-6">
                        <Typography variant="body2" color="text.secondary" className="hover:text-indigo-600 cursor-pointer">
                            Privacy Policy
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="hover:text-indigo-600 cursor-pointer">
                            Terms of Service
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="hover:text-indigo-600 cursor-pointer">
                            Contact Us
                        </Typography>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
