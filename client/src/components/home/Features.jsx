import React, { useState } from "react";
import { Zap, KeyRound, PenSquare, Download } from "lucide-react";
import Title from "./Title";

const FEATURES = [
  {
    title: "Real-Time Analytics",
    desc: "Get instant insights into your finances with live dashboards.",
    icon: KeyRound,
    active: "bg-violet-100 border-violet-300",
    hover: "group-hover:bg-violet-100 group-hover:border-violet-300",
    iconColor: "stroke-violet-600",
  },
  {
    title: "Bank-Grade Security",
    desc: "End-to-end encryption, 2FA, compliance with GDPR standards.",
    icon: PenSquare,
    active: "bg-green-100 border-green-300",
    hover: "group-hover:bg-green-100 group-hover:border-green-300",
    iconColor: "stroke-green-600",
  },
  {
    title: "Customizable Reports",
    desc: "Export professional, audit-ready financial reports for tax or internal review.",
    icon: Download,
    active: "bg-orange-100 border-orange-300",
    hover: "group-hover:bg-orange-100 group-hover:border-orange-300",
    iconColor: "stroke-orange-600",
  },
];

const Features = () => {
  const [activeIndex, setActiveIndex] = useState(0); // first card active

  return (
    <div
      id="features"
      className="flex flex-col items-center my-10 scroll-mt-12 font-[Poppins]"
    >
      
      {/* Badge */}
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-400/10 rounded-full px-6 py-1.5">
        <Zap size={14} />
        <span>Simple Process</span>
      </div>
    <Title title='Build your resume' description='Our streamlined Process helps you create a professional resume in minutes with intelligent AI-powered tools and features'/>

      {/* Heading */}
      

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center xl:-mt-10">
        {/* Image */}
        <img
          className="max-w-2xl w-full xl:-ml-32"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
          alt=""
        />

        {/* Feature Cards */}
        <div className="px-4 md:px-0 space-y-4">
          {FEATURES.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === activeIndex;

            return (
              <div
                key={index}
                className="flex items-center justify-center gap-6 max-w-md group cursor-pointer"
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div
                  className={`p-6 flex gap-4 rounded-xl border transition-colors
                    ${
                      isActive
                        ? item.active
                        : `border-transparent ${item.hover}`
                    }`}
                >
                  <Icon className={`size-6 ${item.iconColor}`} />

                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-slate-700">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 max-w-xs">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Features;
