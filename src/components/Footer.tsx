import { BriefcaseIcon, GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react';
import { Button } from './ui/button';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-white/30 backdrop-blur-lg shadow-sm mt-auto">
            <div className="container mx-auto px-4 py-5">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 ">
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <div className="flex items-center md:items-start space-x-2">
                            <BriefcaseIcon className="h-5 w-4 text-primary" />
                            <span className="font-semibold text-sm">Interview Flow</span>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-xs text-center md:text-left">
                            Streamline your interview process with our comprehensive job application tracking system.
                        </p>
                    </div>


                    <div className="flex flex-col items-center md:items-end space-y-3">
                        <h3 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                            Connect
                        </h3>
                        <div className="md:justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 h-auto text-muted-foreground hover:text-primary"
                                onClick={() => window.open('https://github.com', '_blank')}
                            >
                                <GithubIcon className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 h-auto text-muted-foreground hover:text-primary"
                                onClick={() => window.open('https://linkedin.com', '_blank')}
                            >
                                <LinkedinIcon className="h-4 w-4" />
                                <span className="sr-only">LinkedIn</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 h-auto text-muted-foreground hover:text-primary"
                                onClick={() => window.open('mailto:hello@interviewflow.com', '_blank')}
                            >
                                <MailIcon className="h-4 w-4" />
                                <span className="sr-only">Email</span>
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground md:text-right">
                            Follow us for updates and tips
                        </p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-border pt-4 mt-4">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
                        <p className="text-xs text-muted-foreground">
                            © {currentYear} Interview Flow. All rights reserved.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Made with ❤️ for job seekers everywhere
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
