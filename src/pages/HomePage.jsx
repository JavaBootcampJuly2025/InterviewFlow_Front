import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SecurityIcon from "@mui/icons-material/Security";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AttachmentIcon from "@mui/icons-material/Attachment";
import InterestsIcon from "@mui/icons-material/Interests";

const whyChooseUs = [
  {
    icon: <ThumbUpIcon sx={{ color: "#5c4dff" }} />,
    text: "Save time managing your job search",
  },
  {
    icon: <InterestsIcon sx={{ color: "#5c4dff" }} />,
    text: "Simple and secure platform",
  },
  {
    icon: <SecurityIcon sx={{ color: "#5c4dff" }} />,
    text: "Safe storage for all your resumes",
  },
];

const testimonials = [
  {
    quote:
      "Now I know exactly where I sent my resume - and I can easily track it",
    avatar: "boy.png",
    user: "User #1",
  },
  {
    quote: "Very convenient - I no longer forget about interviews",
    avatar: "woman.png",
    user: "User #2",
  },
  {
    quote: "Simple and clear interface",
    avatar: "gorilla.png",
    user: "User #3",
  },
];

const features = [
  {
    icon: <NotificationsActiveIcon sx={{ fontSize: 36, color: "#5c4dff" }} />,
    title: "Status Tracking",
    desc: "Track application statuses (Viewed, Invited, Rejected) and stay updated.",
  },
  {
    icon: <AddCircleIcon sx={{ fontSize: 36, color: "#5c4dff" }} />,
    title: "Timeline",
    desc: "View your application timeline with important dates and milestones.",
  },
  {
    icon: <ThumbUpIcon sx={{ fontSize: 36, color: "#5c4dff" }} />,
    title: "Reminders",
    desc: "Get interview reminders and notifications so you never miss an event.",
  },
  {
    icon: <InterestsIcon sx={{ fontSize: 36, color: "#5c4dff" }} />,
    title: "Analytics",
    desc: "Access job analytics and insights to optimize your job search.",
  },
  {
    icon: <AttachmentIcon sx={{ fontSize: 36, color: "#5c4dff" }} />,
    title: "Notes & Attachments",
    desc: "Add company-specific notes and attach resumes for each application.",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 36, color: "#5c4dff" }} />,
    title: "Secure Storage",
    desc: "Your data and resumes are stored securely and privately.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Box>
      <Box sx={{ py: 6, textAlign: "center", backgroundColor: "#f5f5f5" }}>
        <Container>
          <Typography variant="h2" gutterBottom>
            Track All Your Job Applications in One Place
          </Typography>
          <Typography variant="h6" gutterBottom>
            Manage your resume statuses and never miss an update again.
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 6, mt: 5 }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<LoginIcon />}
              onClick={() => navigate("/login")}
              sx={{ backgroundColor: "#5c4dff", color: "#fff" }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate("/register")}
              sx={{ borderColor: "#5c4dff", color: "#5c4dff" }}
            >
              Register
            </Button>
          </Box>
        </Container>
      </Box>

      {/* How It Works */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              icon: <AddCircleIcon sx={{ fontSize: 30, color: "#5c4dff" }} />,
              text: "Create an application to which you have sent your resume",
            },
            {
              icon: <AttachmentIcon sx={{ fontSize: 30, color: "#5c4dff" }} />,
              text: "Save the resume you applied for",
            },
            {
              icon: (
                <NotificationsActiveIcon
                  sx={{ fontSize: 30, color: "#5c4dff" }}
                />
              ),
              text: "Get updates and analytics",
            },
          ].map(({ icon, text }, i) => (
            <Grid key={i} item xs={12} sm={4}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  height: 100,
                  width: 200,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features */}
      <Box
        sx={{
          py: 8,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            Key Features
          </Typography>
          <Grid
            container
            spacing={6}
            justifyContent="center"
            alignItems="stretch"
          >
            {features.map(({ icon, title, desc }, i) => (
              <Grid
                key={i}
                item
                xs={12}
                sm={6}
                md={4}
                display="flex"
                justifyContent="center"
              >
                <Paper
                  sx={{
                    p: 3,
                    width: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    mx: "auto",
                  }}
                >
                  {icon}
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Why Choose Us?
        </Typography>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
        >
          {whyChooseUs.map(({ icon, text }, i) => (
            <Grid
              key={i}
              item
              xs={12}
              sm={6}
              display="flex"
              justifyContent="center"
            >
              <Paper
                sx={{
                  p: 3,
                  width: 250,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  mx: "auto",
                  gap: 2,
                }}
              >
                {icon}
                <Typography sx={{ mt: 2 }}>{text}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials */}
      <Box sx={{ py: 8, backgroundColor: "#f0f0f0" }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            What Our Users Say
          </Typography>
          <Grid container spacing={4} display="flex" justifyContent="center">
            {testimonials.map(({ quote, avatar, user }, i) => (
              <Grid key={i} item xs={12} sm={4}>
                <Paper
                  sx={{
                    p: 3,
                    height: "auto",
                    width: { xs: 200, sm: 320, md: 350 },
                  }}
                >
                  <Typography>"{quote}"</Typography>
                  <Box mt={2} display="flex" alignItems="center">
                    <Avatar alt={user} src={avatar} />
                    <Typography ml={2}>{user}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        {[
          {
            q: "How does status tracking work?",
            a: "You can manually update the stage (Applied, Interview, etc.), and the app reminds you when action is needed.",
          },
          {
            q: "Is my data secure?",
            a: "Yes, we use secure storage practices and never share your data.",
          },
          {
            q: "Do companies need to confirm tracking?",
            a: "No, all tracking is user-controlled — no external confirmation required.",
          },
        ].map(({ q, a }, i) => (
          <Accordion key={i}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: "bold" }}>{q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>

      {/* Footer */}
      <Box sx={{ py: 4, backgroundColor: "#333", color: "white" }}>
        <Container>
          <Grid container spacing={4} justifyContent="space-between">
            <Grid item xs={8} sm={6}>
              <Typography variant="h6">InterviewFlow</Typography>
              <Typography>© 2025 All rights reserved</Typography>
            </Grid>
            <Grid item xs={12} sm={6} justifyContent={"flex-end"}>
              <Typography>Contacts: support@interviewflow.app</Typography>
              <Typography>Privacy Policy | User Agreement</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
