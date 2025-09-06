import { BotMessageSquare } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { Fingerprint } from "lucide-react";
import { ShieldHalf } from "lucide-react";
import { PlugZap } from "lucide-react";
import { GlobeLock } from "lucide-react";

import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";
import user4 from "../assets/profile-pictures/user4.jpg";
import user5 from "../assets/profile-pictures/user5.jpg";
import user6 from "../assets/profile-pictures/user6.jpg";

export const navItems = [
  { label: "Features", href: "#" },
  { label: "Workflow", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Testimonials", href: "#" },
];

export const testimonials = [
  {
    user: "Rajesh M.",
    company: "Mumbai",
    image: user1,
    text: "VedAI is like having a personal Guru available 24/7. Whenever I feel lost, it gives me the right Bhagavad Gita shloka with deep meaning. Truly life-changing!",
  },
  {

    text: "I was struggling with career decisions, and VedAI provided a Gita verse that perfectly aligned with my situation. The AI-powered wisdom feels so real and personal!",
    user: "Sneha P.",
    company: "Bengaluru",
    image: user2,
  },
  {
    text: "I love the Muhurat and Choghadiya feature! It helps me plan my daily activities according to Vedic astrology. A must-have spiritual assistant!",
    user: "Amit K.",
    company: "Ahmedabad",
    image: user3,
  },
  {
    text: "The AI-guided puja instructions and Katha planner have made our family rituals so much easier. VedAI preserves tradition in a modern way!",
    user: "Pooja S.",
    company: "Delhi",
    image: user4,
  },
  
];

export const features = [
  {
    icon: <BotMessageSquare />,
    text: "Drag-and-Drop Interface",
    description:
      "Easily design and arrange your VR environments with a user-friendly drag-and-drop interface.",
  },
  {
    icon: <Fingerprint />,
    text: "Multi-Platform Compatibility",
    description:
      "Build VR applications that run seamlessly across multiple platforms, including mobile, desktop, and VR headsets.",
  },
  {
    icon: <ShieldHalf />,
    text: "Built-in Templates",
    description:
      "Jumpstart your VR projects with a variety of built-in templates for different types of applications and environments.",
  },
  {
    icon: <BatteryCharging />,
    text: "Real-Time Preview",
    description:
      "Preview your VR application in real-time as you make changes, allowing for quick iterations and adjustments.",
  },
  {
    icon: <PlugZap />,
    text: "Collaboration Tools",
    description:
      "Work together with your team in real-time on VR projects, enabling seamless collaboration and idea sharing.",
  },
  {
    icon: <GlobeLock />,
    text: "Analytics Dashboard",
    description:
      "Gain valuable insights into user interactions and behavior within your VR applications with an integrated analytics dashboard.",
  },
];

export const checklistItems = [
  {
    title: "Code merge made easy",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "Review code without worry",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "AI Assistance to reduce time",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "Share work in minutes",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
];
export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Access to basic Bhagavad Gita guidance",
      "Daily shloka notifications",
      "Limited dream interpretation",
      "Explore 1 Veda insights",
    ],
  },
  {
    title: "Pro",
    price: "$15",
    features: [
      "Full Bhagavad Gita guidance with explanations",
      "Customized learning path based on your progress",
      "Personalized puja suggestions",
      "Hindu baby name suggestions based on Rashi/Nakshatra",
      "Access to all 4 Vedas insights",
    ],
  },
  {
    title: "Enterprise",
    price: "$50",
    features: [
      "AI-guided Katha & spiritual planning for families",
      "Advanced dream analysis & interpretation",
      "Priority AI support for queries",
      "Team/family account sharing",
      "Full access to all Vedic tools & features",
    ],
  },
];


export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];
