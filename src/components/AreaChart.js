import { AreaClosed, Bar } from "@visx/shape";
import { AxisBottom, AxisLeft, AxisRight } from "@visx/axis";
import { Grid, GridColumns, GridRows } from "@visx/grid";
import {
  Tooltip,
  TooltipWithBounds,
  defaultStyles,
  withTooltip,
} from "@visx/tooltip";
import { currencyFormatter, oneMonth, oneWeek } from "app/core";
import { scaleLinear, scaleTime } from "@visx/scale";
import { useCallback, useMemo, useState } from "react";

import ChartOverlay from "./ChartOverlay";
import { GradientTealBlue } from "@visx/gradient";
import { Group } from "@visx/group";
import { bisector } from "d3-array";
import { deepPurple } from "@material-ui/core/colors";
import { localPoint } from "@visx/event";
import millify from "millify";
import { timeFormat } from "d3-time-format";

const tooltipStyles = {
  ...defaultStyles,
  background: "#fff",
  border: "1px solid white",
  color: "inherit",
  zIndex: 1702,
};

const getDate = (d) => new Date(d.date);
const bisectDate = bisector((d) => new Date(d.date)).left;
const getValue = (d) => (d && d.hasOwnProperty("value") ? d.value : 0);

const formatDate = timeFormat("%b %d, '%y");

function AreaChart({
  data,
  tooltipDisabled = false,
  overlayEnabled = false,
  title = "",
  width,
  height,
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipTop = 0,
  tooltipLeft = 0,
  onTimespanChange,
  margin = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
}) {
  const [timespan, setTimespan] = useState(oneMonth());

  function onTimespanChange(e) {
    if (e.currentTarget.value === "ALL") {
      setTimespan(62802180);
    } else if (e.currentTarget.value === "1W") {
      setTimespan(oneWeek());
    } else if (e.currentTarget.value === "1M") {
      setTimespan(oneMonth());
    }
  }

  data = data.filter((d) => timespan <= d.date);
  var lastData = data.length > 1 ? data[data.length - 1] : null;
  const lastDataValue = lastData ? lastData.value : 0;
  const [overlay, setOverlay] = useState({
    title,
    value: currencyFormatter.format(lastDataValue),
    date: lastData ? lastData.date : 0,
  });

  // Max
  const xMax = width - margin.left - margin.right;

  const yMax = height - margin.top - margin.bottom;

  // Scales
  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: [
          Math.min(...data.map(getDate)),
          Math.max(...data.map(getDate)),
        ],
      }),
    [xMax, data]
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [
          Math.min(...data.map((d) => getValue(d))),
          Math.max(...data.map((d) => getValue(d))),
        ],
        nice: true,
      }),
    [yMax, data]
  );

  // tooltip handler
  const handleTooltip = useCallback(
    (event) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = xScale.invert(x);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() >
          getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }
      const lastDataValue = d ? d.value : 0;
      setOverlay({
        ...overlay,
        value: currencyFormatter.format(lastDataValue),
        date: d && d.hasOwnProperty("date") ? d.date : 0,
      });
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: yScale(getValue(d)),
      });
    },
    [showTooltip, yScale, xScale]
  );

  if (width < 10) return null;

  return (
    <div style={{ position: "relative" }}>
      {overlayEnabled && (
        <>
          <ChartOverlay overlay={overlay} onTimespanChange={onTimespanChange} />
        </>
      )}
      <svg width={width} height={height}>
        <GradientTealBlue id="teal" fromOffset={0.5} />
        <rect x={0} y={0} width={width} height={height} fill="transparent" />

        <Group top={margin.top} left={margin.left}>
          <AreaClosed
            data={data}
            x={(d) => xScale(getDate(d))}
            y={(d) => yScale(getValue(d))}
            yScale={yScale}
            fill="url(#teal)"
          />
        </Group>
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => {
            const lastDataValue =
              data && data.length > 0 ? data[data.length - 1].value : 0;
            hideTooltip();
            setOverlay({
              ...overlay,
              value: currencyFormatter.format(lastDataValue),
              date: data && data.length ? data[data.length - 1].date : 0,
            });
          }}
        />

        {tooltipData && (
          <Group top={margin.top} left={margin.left}>
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill={deepPurple[400]}
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </Group>
        )}
      </svg>
      {!tooltipDisabled && tooltipData && (
        <div>
          <Tooltip
            top={margin.top + tooltipTop - 12}
            left={tooltipLeft + 12}
            style={tooltipStyles}
          >
            {`$${millify(getValue(tooltipData))}`}
          </Tooltip>
          <Tooltip
            top={yMax + margin.top - 14}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              minWidth: 90,
              textAlign: "center",
              transform: "translateX(-50%)",
            }}
          >
            {formatDate(getDate(tooltipData))}
          </Tooltip>
        </div>
      )}
    </div>
  );
}

export default withTooltip(AreaChart);
