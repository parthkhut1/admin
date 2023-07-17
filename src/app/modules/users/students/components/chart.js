import React, { useMemo, useEffect, useState } from "react";
import { HorizontalBar } from "react-chartjs-2";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

const options = {
  scales: {
    xAxes: [
      {
        ticks: {
          beginAtZero: true,
          stepSize: 1,
        },
      },
    ],
  },
  maintainAspectRatio: true,
  responsive: true,
  legend: {
    display: false,
  },
};

const HorizontalBarChart = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState({});

  const { statistics } = useSelector(
    (state) => ({
      statistics: state.students.statistics,
    }),
    shallowEqual
  );

  useEffect(() => {
    const newData = {};
    newData["labels"] = statistics["practiced-questions-by-type"].map((i) =>
      i.question_type.match(/[A-Z][a-z]+/g).join(" ")
    );
    newData["datasets"] = [
      {
        label: "# of practiced questions",
        data: statistics["practiced-questions-by-type"].map((i) => i.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ];

    setData(newData);
  }, [statistics]);
  return (
    <>
        <div style={{margin: "20px 0px 20px 18px", fontSize:14, fontWeight: 600}}>
            <span>User attempts to practice questions</span>
        </div>
      <HorizontalBar data={data} options={options} />
    </>
  );
};

export default HorizontalBarChart;
