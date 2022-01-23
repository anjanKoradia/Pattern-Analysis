import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import BarChart from "./BarChart";
import moment from "moment";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";

type scheduleType = {
  schedule_time: Date;
  slot: string;
  item_date: Date;
};

function App() {
  const [oneDate, setOneDate] = useState(new Date());
  const [rangeDate, setRangeDate] = useState<{ start: any; end: any }>({
    start: new Date(),
    end: new Date(),
  });

  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDateScheduleData, setSelectedDateScheduleData] = useState([]);
  const [rangeDateScheduleData, setRangeDateScheduleData] = useState([]);

  const [loding, setLoding] = useState("");

  useEffect(() => {
    setLoding("loder_container");
    getScheduleData();
  }, [oneDate, rangeDate]);

  async function getScheduleData() {
    await fetch("https://jsonkeeper.com/b/HU8U")
      .then((response) => response.json())
      .then((res) => {
        setScheduleData(res);
        let oneDateData = res.filter((val: scheduleType) => {
          let selctedOneDate: string = moment(oneDate).format("YYYY-MM-DD");

          return moment(val.item_date).format("YYYY-MM-DD") === selctedOneDate;
        });
        setSelectedDateScheduleData(oneDateData);

        let rangeDateData = res.filter((val: scheduleType) => {
          let d = moment(val.schedule_time).format("YYYY-MM-DD");
          let rangeDateStart = moment(rangeDate.start).format("YYYY-MM-DD");
          let rangeDateEnd = moment(rangeDate.end).format("YYYY-MM-DD");
          return moment(d, "YYYY-MM-DD").isBetween(
            moment(rangeDateStart, "YYYY-MM-DD"),
            moment(rangeDateEnd, "YYYY-MM-DD"),
            undefined,
            "[]"
          );
        });
        setRangeDateScheduleData(rangeDateData);

        setLoding("");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const datasetOne = {
    labelArray: () => {
      let perviousDates = new Array();
      for (let i: number = 2; i > 0; i--) {
        perviousDates.push(
          moment(oneDate).subtract(i, "days").format("DD MMM YYYY")
        );
      }
      let nextDates = new Array();
      for (let i: number = 1; i <= 2; i++) {
        nextDates.push(moment(oneDate).add(i, "days").format("DD MMM YYYY"));
      }

      return [
        ...perviousDates,
        moment(oneDate).format("DD MMM YYYY"),
        ...nextDates,
      ];
    },
    dataArray: () => {
      let data = new Array();

      datasetOne.labelArray().forEach((date: Date) => {
        let d = new Date(date);
        let arr = scheduleData.filter((val: scheduleType) => {
          return (
            moment(val.item_date).format("YYYY-MM-DD") ===
            moment(d).format("YYYY-MM-DD")
          );
        });
        data.push(arr.length);
      });

      return data;
    },
    backgroundColor: [
      "rgba(201, 203, 207, 0.4)",
      "rgba(201, 203, 207, 0.4)",
      "rgba(54, 162, 235, 0.4)",
      "rgba(201, 203, 207, 0.4)",
      "rgba(201, 203, 207, 0.4)",
    ],
    borderColor: [
      "rgb(201, 203, 207)",
      "rgb(201, 203, 207)",
      "rgb(54, 162, 235)",
      "rgb(201, 203, 207)",
      "rgb(201, 203, 207)",
    ],
    label: "Total Delivery (Date)",
  };

  const datasetTwo = {
    labelArray: () => {
      return ["9am to 12am", "12am to 3pm", "3pm to 6pm", "6pm to 9pm"];
    },
    dataArray: () => {
      let nineTo12 = new Array();
      let twelveTo3 = new Array();
      let threeTo6 = new Array();
      let sixTo9 = new Array();

      selectedDateScheduleData.forEach((val: scheduleType) => {
        let currentTime = moment(val.schedule_time).format("HH:MM:SS");

        if (
          moment(currentTime, "hh:mm:ss").isBetween(
            moment("09:00:00", "hh:mm:ss"),
            moment("12:00:00", "hh:mm:ss")
          )
        ) {
          nineTo12.push(val);
        }
        if (
          moment(currentTime, "hh:mm:ss").isBetween(
            moment("12:00:00", "hh:mm:ss"),
            moment("15:00:00", "hh:mm:ss")
          )
        ) {
          twelveTo3.push(val);
        }
        if (
          moment(currentTime, "hh:mm:ss").isBetween(
            moment("15:00:00", "hh:mm:ss"),
            moment("18:00:00", "hh:mm:ss")
          )
        ) {
          threeTo6.push(val);
        }
        if (
          moment(currentTime, "hh:mm:ss").isBetween(
            moment("18:00:00", "hh:mm:ss"),
            moment("21:00:00", "hh:mm:ss")
          )
        ) {
          sixTo9.push(val);
        }
      });

      return [
        nineTo12.length,
        twelveTo3.length,
        threeTo6.length,
        sixTo9.length,
      ];
    },
    backgroundColor: [
      "rgba(255, 99, 132, 0.4)",
      "rgba(153, 102, 255, 0.4)",
      "rgba(255, 205, 86, 0.4)",
      "rgba(75, 192, 192, 0.4)",
    ],
    borderColor: [
      "rgb(255, 99, 132)",
      "rgb(153, 102, 255)",
      "rgb(255, 205, 86)",
      "rgb(75, 192, 192)",
    ],
    label: "Total Schedule Meal (Time Range)",
  };

  const datasetThree = {
    labelArray: () => {
      return ["1 Day Prior", "2 Day Prior"];
    },
    dataArray: () => {
      let oneDayPrior = new Array();
      let twoDayPrior = new Array();

      rangeDateScheduleData.forEach((val: scheduleType) => {
        let schdldate = moment(val.schedule_time).format("yyyy-mm-dd");
        let itemdate = moment(val.item_date).format("yyyy-mm-dd");
        if (
          moment(itemdate, "yyyy-mm-dd").diff(
            moment(schdldate, "yyyy-mm-dd"),
            "day"
          ) === 1
        ) {
          oneDayPrior.push(val);
        }
        if (
          moment(itemdate, "yyyy-mm-dd").diff(
            moment(schdldate, "yyyy-mm-dd"),
            "day"
          ) === 2
        ) {
          twoDayPrior.push(val);
        }
      });

      return [oneDayPrior.length, twoDayPrior.length];
    },
    backgroundColor: ["rgba(75, 192, 192, 0.4)", "rgba(255, 159, 64, 0.4)"],
    borderColor: ["rgb(75, 192, 192)", "rgb(255, 159, 64)"],
    label: "Prior Scheduling",
  };

  const datasetFour = {
    labelArray: () => {
      let perviousDates = new Array();
      for (let i: number = 2; i > 0; i--) {
        perviousDates.push(
          moment(oneDate).subtract(i, "days").format("DD MMM YYYY")
        );
      }
      let nextDates = new Array();
      for (let i: number = 1; i <= 2; i++) {
        nextDates.push(moment(oneDate).add(i, "days").format("DD MMM YYYY"));
      }

      return [
        ...perviousDates,
        moment(oneDate).format("DD MMM YYYY"),
        ...nextDates,
      ];
    },
    dataArray: () => {
      let data = new Array();

      datasetOne.labelArray().forEach((date: Date) => {
        let d = new Date(date);
        let arr = scheduleData.filter((val: scheduleType) => {
          return (
            moment(val.schedule_time).format("YYYY-MM-DD") ===
            moment(d).format("YYYY-MM-DD")
          );
        });
        data.push(arr.length);
      });

      return data;
    },
    backgroundColor: [
      "rgba(201, 203, 207, 0.4)",
      "rgba(201, 203, 207, 0.4)",
      "rgba(54, 162, 235, 0.4)",
      "rgba(201, 203, 207, 0.4)",
      "rgba(201, 203, 207, 0.4)",
    ],
    borderColor: [
      "rgb(201, 203, 207)",
      "rgb(201, 203, 207)",
      "rgb(54, 162, 235)",
      "rgb(201, 203, 207)",
      "rgb(201, 203, 207)",
    ],
    label: "Total Scheduled Meal (Date)",
  };

  return (
    <div className="App">
      <div className="calendar_container">
        <div className="oneDate">
          <h2>Pick One Date</h2>
          <Calendar
            className="calendar"
            value={oneDate}
            onChange={(date: Date) => setOneDate(date)}
          />
        </div>
        <div className="dateRang">
          <h2>Pick Date Range</h2>
          <DateRangePicker
            className="calendar"
            onSelect={(dates: any) => setRangeDate(dates)}
          />
        </div>
      </div>
      <div className="chart_container">
        <h1>Customer Scheduling Patterns Analysis</h1>
        <div className="charts">
          <div className="chartOne">
            <BarChart dataSet={datasetOne} className={loding} />
          </div>
          <div className="chartTwo">
            <BarChart dataSet={datasetTwo} className={loding} />
          </div>
        </div>
        <div className="charts">
          <div className="chartThree">
            <BarChart dataSet={datasetThree} className={loding} />
          </div>
          <div className="chartFour">
            <BarChart dataSet={datasetFour} className={loding} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
