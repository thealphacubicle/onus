"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import type { ChartConfiguration } from "chart.js";

const gaussian = (x: number, mu: number, sigma: number) =>
  Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));

function generateCurve(mu: number, sigma: number) {
  const points: { x: number; y: number }[] = [];
  for (let x = 0; x <= 100; x += 0.5) {
    points.push({ x, y: gaussian(x, mu, sigma) });
  }
  return points;
}

const WITHOUT_ONUS_DATA = generateCurve(35, 18);
const ORIGINAL_FADED_DATA = generateCurve(35, 18);
const ONUS_DATA = generateCurve(62, 15);

function lossTailData() {
  const points: { x: number; y: number }[] = [];
  for (let x = 0; x <= 35; x += 0.5) {
    points.push({ x, y: gaussian(x, 35, 18) });
  }
  return points;
}

function rewardTailData() {
  const points: { x: number; y: number }[] = [];
  for (let x = 62; x <= 100; x += 0.5) {
    points.push({ x, y: gaussian(x, 62, 15) });
  }
  return points;
}

export function BehavioralScienceViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lossAnnotationRef = useRef<HTMLSpanElement>(null);
  const rewardAnnotationRef = useRef<HTMLSpanElement>(null);
  const withoutBtnRef = useRef<HTMLButtonElement>(null);
  const withBtnRef = useRef<HTMLButtonElement>(null);
  const lossCardRef = useRef<HTMLDivElement>(null);
  const rewardCardRef = useRef<HTMLDivElement>(null);
  const onusCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let isWithOnus = false;
    let activeCard: "loss" | "reward" | "onus" | null = null;

    const showAnnotation = (ref: React.RefObject<HTMLSpanElement | null>, show: boolean) => {
      const el = ref.current;
      if (el) el.style.opacity = show ? "1" : "0";
    };

    const setCardActive = (card: HTMLDivElement | null, active: boolean, borderColor: string) => {
      if (!card) return;
      card.style.borderColor = active ? borderColor : "rgba(255,255,255,0.07)";
    };

    const applyCardState = () => {
      const chart = chartRef.current;
      if (!chart) return;

      if (activeCard === null) {
        showAnnotation(lossAnnotationRef, false);
        showAnnotation(rewardAnnotationRef, false);
        setCardActive(lossCardRef.current, false, "");
        setCardActive(rewardCardRef.current, false, "");
        setCardActive(onusCardRef.current, false, "");

        chart.data.datasets = isWithOnus
          ? [
              {
                data: ORIGINAL_FADED_DATA,
                borderColor: "rgba(240,112,112,0.25)",
                backgroundColor: "rgba(240,112,112,0.05)",
                fill: true,
                tension: 0.4,
                parsing: false,
                pointRadius: 0,
                borderWidth: 2,
              },
              {
                data: ONUS_DATA,
                borderColor: "#c8f060",
                backgroundColor: "rgba(200,240,96,0.15)",
                fill: true,
                tension: 0.4,
                parsing: false,
                pointRadius: 0,
                borderWidth: 2,
              },
            ]
          : [
              {
                data: WITHOUT_ONUS_DATA,
                borderColor: "#f07070",
                backgroundColor: "rgba(240,112,112,0.12)",
                fill: true,
                tension: 0.4,
                parsing: false,
                pointRadius: 0,
                borderWidth: 2,
              },
            ];
      } else if (activeCard === "loss") {
        showAnnotation(lossAnnotationRef, true);
        showAnnotation(rewardAnnotationRef, false);
        setCardActive(lossCardRef.current, true, "rgba(240,112,112,0.6)");
        setCardActive(rewardCardRef.current, false, "");
        setCardActive(onusCardRef.current, false, "");

        if (isWithOnus) {
          chart.data.datasets = [
            {
              data: ORIGINAL_FADED_DATA,
              borderColor: "rgba(240,112,112,0.25)",
              backgroundColor: "rgba(240,112,112,0.05)",
              fill: true,
              tension: 0.4,
              parsing: false,
              pointRadius: 0,
              borderWidth: 2,
            },
            {
              data: ONUS_DATA,
              borderColor: "rgba(200,240,96,0.25)",
              backgroundColor: "rgba(200,240,96,0.05)",
              fill: true,
              tension: 0.4,
              parsing: false,
              pointRadius: 0,
              borderWidth: 2,
            },
            {
              data: lossTailData(),
              borderColor: "#f07070",
              backgroundColor: "rgba(240,112,112,0.2)",
              fill: true,
              tension: 0.4,
              parsing: false,
              pointRadius: 0,
              borderWidth: 2,
            },
          ];
        } else {
          chart.data.datasets = [
            {
              data: WITHOUT_ONUS_DATA,
              borderColor: "rgba(240,112,112,0.4)",
              backgroundColor: "rgba(240,112,112,0.06)",
              fill: true,
              tension: 0.4,
              parsing: false,
              pointRadius: 0,
              borderWidth: 2,
            },
            {
              data: lossTailData(),
              borderColor: "#f07070",
              backgroundColor: "rgba(240,112,112,0.25)",
              fill: true,
              tension: 0.4,
              parsing: false,
              pointRadius: 0,
              borderWidth: 2,
            },
          ];
        }
      } else if (activeCard === "reward") {
        showAnnotation(lossAnnotationRef, false);
        showAnnotation(rewardAnnotationRef, true);
        setCardActive(lossCardRef.current, false, "");
        setCardActive(rewardCardRef.current, true, "rgba(200,240,96,0.6)");
        setCardActive(onusCardRef.current, false, "");

        if (isWithOnus) {
          chart.data.datasets = [
            {
              data: ORIGINAL_FADED_DATA,
              borderColor: "rgba(240,112,112,0.15)",
              backgroundColor: "rgba(240,112,112,0.03)",
              fill: true,
              tension: 0.4,
              parsing: false,
              pointRadius: 0,
              borderWidth: 2,
            },
            {
              data: ONUS_DATA,
              borderColor: "rgba(200,240,96,0.4)",
              backgroundColor: "rgba(200,240,96,0.08)",
              fill: true,
              tension: 0.4,
              parsing: false,
              pointRadius: 0,
              borderWidth: 2,
            },
            {
              data: rewardTailData(),
              borderColor: "#c8f060",
              backgroundColor: "rgba(200,240,96,0.3)",
              fill: true,
              tension: 0.4,
              parsing: false,
              pointRadius: 0,
              borderWidth: 2,
            },
          ];
        } else {
          chart.data.datasets = [
            {
              data: WITHOUT_ONUS_DATA,
              borderColor: "#f07070",
              backgroundColor: "rgba(240,112,112,0.12)",
              fill: true,
              tension: 0.4,
              parsing: false,
              pointRadius: 0,
              borderWidth: 2,
            },
          ];
        }
      } else if (activeCard === "onus") {
        showAnnotation(lossAnnotationRef, false);
        showAnnotation(rewardAnnotationRef, false);
        setCardActive(lossCardRef.current, false, "");
        setCardActive(rewardCardRef.current, false, "");
        setCardActive(onusCardRef.current, true, "rgba(200,240,96,0.8)");

        if (!isWithOnus) {
          isWithOnus = true;
          if (withoutBtnRef.current && withBtnRef.current) {
            withoutBtnRef.current.classList.remove("bg-[#c8f060]", "text-[#0e0e10]");
            withoutBtnRef.current.classList.add("text-[rgba(240,239,232,0.7)]");
            withBtnRef.current.classList.add("bg-[#c8f060]", "text-[#0e0e10]");
            withBtnRef.current.classList.remove("text-[rgba(240,239,232,0.7)]");
          }
        }

        chart.data.datasets = [
          {
            data: ORIGINAL_FADED_DATA,
            borderColor: "rgba(240,112,112,0.25)",
            backgroundColor: "rgba(240,112,112,0.05)",
            fill: true,
            tension: 0.4,
            parsing: false,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            data: ONUS_DATA,
            borderColor: "#c8f060",
            backgroundColor: "rgba(200,240,96,0.2)",
            fill: true,
            tension: 0.4,
            parsing: false,
            pointRadius: 0,
            borderWidth: 2,
          },
        ];
      }

      chart.options.animation = { duration: 200 };
      chart.update();
      chart.options.animation = { duration: 600 };
    };

    const switchToWithOnus = () => {
      if (isWithOnus) return;
      isWithOnus = true;
      if (withoutBtnRef.current && withBtnRef.current) {
        withoutBtnRef.current.classList.remove("bg-[#c8f060]", "text-[#0e0e10]");
        withoutBtnRef.current.classList.add("text-[rgba(240,239,232,0.7)]");
        withBtnRef.current.classList.add("bg-[#c8f060]", "text-[#0e0e10]");
        withBtnRef.current.classList.remove("text-[rgba(240,239,232,0.7)]");
      }
      chartRef.current!.data.datasets = [
        {
          data: ORIGINAL_FADED_DATA,
          borderColor: "rgba(240,112,112,0.25)",
          backgroundColor: "rgba(240,112,112,0.05)",
          fill: true,
          tension: 0.4,
          parsing: false,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          data: ONUS_DATA,
          borderColor: "#c8f060",
          backgroundColor: "rgba(200,240,96,0.15)",
          fill: true,
          tension: 0.4,
          parsing: false,
          pointRadius: 0,
          borderWidth: 2,
        },
      ];
      chartRef.current!.update();
    };

    const config: ChartConfiguration<"line"> = {
      type: "line",
      data: {
        datasets: [
          {
            data: WITHOUT_ONUS_DATA,
            borderColor: "#f07070",
            backgroundColor: "rgba(240,112,112,0.12)",
            fill: true,
            tension: 0.4,
            parsing: false,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 600,
        },
        transitions: {
          active: { animation: { duration: 200 } },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        scales: {
          x: {
            type: "linear",
            min: 0,
            max: 100,
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: {
              stepSize: 50,
              callback(_, index, ticks) {
                const v = ticks[index]?.value;
                if (v === 0) return "Never";
                if (v === 50) return "Attendance →";
                if (v === 100) return "Consistent";
                return "";
              },
              color: "rgba(240,239,232,0.5)",
              font: { size: 11 },
            },
          },
          y: {
            display: false,
            min: 0,
            max: 1.1,
          },
        },
      },
    };

    const chart = new Chart(canvas, config);
    chartRef.current = chart;

    const toggleWithout = () => {
      if (isWithOnus) {
        isWithOnus = false;
        if (withoutBtnRef.current && withBtnRef.current) {
          withoutBtnRef.current.classList.add("bg-[#c8f060]", "text-[#0e0e10]");
          withoutBtnRef.current.classList.remove("text-[rgba(240,239,232,0.7)]");
          withBtnRef.current.classList.remove("bg-[#c8f060]", "text-[#0e0e10]");
          withBtnRef.current.classList.add("text-[rgba(240,239,232,0.7)]");
        }
        chart.data.datasets = [
          {
            data: WITHOUT_ONUS_DATA,
            borderColor: "#f07070",
            backgroundColor: "rgba(240,112,112,0.12)",
            fill: true,
            tension: 0.4,
            parsing: false,
            pointRadius: 0,
            borderWidth: 2,
          },
        ];
        chart.update();
        if (activeCard === "onus") applyCardState();
      }
    };

    const toggleWith = () => {
      if (!isWithOnus) {
        isWithOnus = true;
        if (withoutBtnRef.current && withBtnRef.current) {
          withoutBtnRef.current.classList.remove("bg-[#c8f060]", "text-[#0e0e10]");
          withoutBtnRef.current.classList.add("text-[rgba(240,239,232,0.7)]");
          withBtnRef.current.classList.add("bg-[#c8f060]", "text-[#0e0e10]");
          withBtnRef.current.classList.remove("text-[rgba(240,239,232,0.7)]");
        }
        chart.data.datasets = [
          {
            data: ORIGINAL_FADED_DATA,
            borderColor: "rgba(240,112,112,0.25)",
            backgroundColor: "rgba(240,112,112,0.05)",
            fill: true,
            tension: 0.4,
            parsing: false,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            data: ONUS_DATA,
            borderColor: "#c8f060",
            backgroundColor: "rgba(200,240,96,0.15)",
            fill: true,
            tension: 0.4,
            parsing: false,
            pointRadius: 0,
            borderWidth: 2,
          },
        ];
        chart.options.animation = { duration: 600, easing: "easeInOutQuart" as const };
        chart.update();
        chart.options.animation = { duration: 600 };
        if (activeCard) applyCardState();
      }
    };

    const handleLossEnter = () => {
      activeCard = "loss";
      applyCardState();
    };
    const handleRewardEnter = () => {
      activeCard = "reward";
      applyCardState();
    };
    const handleOnusEnter = () => {
      activeCard = "onus";
      if (!isWithOnus) {
        switchToWithOnus();
        chart.options.animation = { duration: 600, easing: "easeInOutQuart" as const };
        chart.update();
        chart.options.animation = { duration: 600 };
      }
      applyCardState();
    };
    const handleLeave = () => {
      activeCard = null;
      applyCardState();
    };

    const withoutBtn = withoutBtnRef.current;
    const withBtn = withBtnRef.current;
    const lossCard = lossCardRef.current;
    const rewardCard = rewardCardRef.current;
    const onusCard = onusCardRef.current;

    withoutBtn?.addEventListener("click", toggleWithout);
    withBtn?.addEventListener("click", toggleWith);
    lossCard?.addEventListener("mouseenter", handleLossEnter);
    lossCard?.addEventListener("mouseleave", handleLeave);
    lossCard?.addEventListener("click", handleLossEnter);
    rewardCard?.addEventListener("mouseenter", handleRewardEnter);
    rewardCard?.addEventListener("mouseleave", handleLeave);
    rewardCard?.addEventListener("click", handleRewardEnter);
    onusCard?.addEventListener("mouseenter", handleOnusEnter);
    onusCard?.addEventListener("mouseleave", handleLeave);
    onusCard?.addEventListener("click", handleOnusEnter);

    return () => {
      withoutBtn?.removeEventListener("click", toggleWithout);
      withBtn?.removeEventListener("click", toggleWith);
      lossCard?.removeEventListener("mouseenter", handleLossEnter);
      lossCard?.removeEventListener("mouseleave", handleLeave);
      lossCard?.removeEventListener("click", handleLossEnter);
      rewardCard?.removeEventListener("mouseenter", handleRewardEnter);
      rewardCard?.removeEventListener("mouseleave", handleLeave);
      rewardCard?.removeEventListener("click", handleRewardEnter);
      onusCard?.removeEventListener("mouseenter", handleOnusEnter);
      onusCard?.removeEventListener("mouseleave", handleLeave);
      onusCard?.removeEventListener("click", handleOnusEnter);
      chart.destroy();
      chartRef.current = null;
    };
  }, []);

  return (
    <div className="mt-12 w-full">
      {/* Toggle */}
      <div className="mb-8 flex justify-center">
        <div
          className="inline-flex rounded-full bg-[#131315] p-1"
          role="tablist"
          aria-label="Chart mode"
        >
          <button
            ref={withoutBtnRef}
            type="button"
            role="tab"
            aria-selected={true}
            className="rounded-full bg-[#c8f060] px-5 py-2.5 text-sm font-medium text-[#0e0e10] transition-all duration-200 ease-out"
          >
            Without Onus
          </button>
          <button
            ref={withBtnRef}
            type="button"
            role="tab"
            aria-selected={false}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-[rgba(240,239,232,0.7)] transition-all duration-200 ease-out hover:text-[rgba(240,239,232,0.9)]"
          >
            With Onus
          </button>
        </div>
      </div>

      {/* Chart */}
      <div ref={containerRef} className="relative h-[280px] w-full">
        <canvas ref={canvasRef} />
        <span
          ref={lossAnnotationRef}
          className="absolute bottom-2 left-4 text-xs font-medium transition-opacity duration-300"
          style={{
            color: "rgba(240,112,112,0.7)",
            opacity: 0,
          }}
        >
          Loss aversion zone
        </span>
        <span
          ref={rewardAnnotationRef}
          className="absolute bottom-2 right-4 text-xs font-medium transition-opacity duration-300"
          style={{
            color: "rgba(200,240,96,0.8)",
            opacity: 0,
          }}
        >
          Reward zone
        </span>
      </div>

      {/* Cards */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div
          ref={lossCardRef}
          className="cursor-pointer rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6 transition-all duration-200 ease-out"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLElement).click()}
        >
          <div className="flex items-start gap-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0"
              aria-hidden
            >
              <path
                d="M12 9v2m0 4v.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="#f07070"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 9v2m0 4v.01"
                stroke="#f07070"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <h3 className="text-base font-medium text-[#f0efe8]">
                Loss aversion
              </h3>
              <p className="mt-2 text-sm text-[rgba(240,239,232,0.7)]">
                People feel the pain of losing $10 twice as strongly as the
                pleasure of gaining $10. A missed session costs real money —
                immediately.
              </p>
              <span className="mt-3 inline-block rounded-full bg-[rgba(240,112,112,0.15)] px-3 py-1 text-xs font-medium text-[#f07070]">
                2× more motivating than reward alone
              </span>
            </div>
          </div>
        </div>

        <div
          ref={rewardCardRef}
          className="cursor-pointer rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6 transition-all duration-200 ease-out"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLElement).click()}
        >
          <div className="flex items-start gap-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0"
              aria-hidden
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#c8f060"
                strokeWidth="2"
              />
              <path
                d="M8 12l3 3 5-6"
                stroke="#c8f060"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <h3 className="text-base font-medium text-[#f0efe8]">
                Positive reinforcement
              </h3>
              <p className="mt-2 text-sm text-[rgba(240,239,232,0.7)]">
                Consistent attendance earns rewards redeemable for gym
                memberships, supplements, and gear. Showing up pays — literally.
              </p>
              <span className="mt-3 inline-block rounded-full bg-[rgba(200,240,96,0.15)] px-3 py-1 text-xs font-medium text-[#c8f060]">
                Rewards accumulate every session
              </span>
            </div>
          </div>
        </div>

        <div
          ref={onusCardRef}
          className="cursor-pointer rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6 transition-all duration-200 ease-out"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLElement).click()}
        >
          <div className="flex items-start gap-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0"
              aria-hidden
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="rgba(200,240,96,0.8)"
                strokeWidth="2"
              />
              <path
                d="M12 6v6l4 2"
                stroke="rgba(200,240,96,0.8)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <h3 className="text-base font-medium text-[#f0efe8]">
                The Onus effect
              </h3>
              <p className="mt-2 text-sm text-[rgba(240,239,232,0.7)]">
                Combined penalty and reward shifts the attendance distribution
                right. The habit forms faster because both levers pull in the
                same direction.
              </p>
              <span className="mt-3 inline-block rounded-full bg-[rgba(200,240,96,0.15)] px-3 py-1 text-xs font-medium text-[#c8f060]">
                Distribution shifts right over 90 days
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
