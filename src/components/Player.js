import React from "react";
import video_metadata from "../data/video_metadata.json";

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      current_duration: 0,
      section_index: 0,
      current_section: {},
      countdown: 3,
      countdownFlag: false,
      maintain_time: 5000,
    };
  }
  componentDidMount() {
    this.getMetadata();
  }
  getMetadata = () => {
    const { head, sections, tail } = video_metadata;
    const metadata = [];
    metadata.push({
      title: "head",
      duration: head,
      sectionType: "HEAD",
    });
    Array.prototype.push.apply(metadata, sections);
    metadata.push({
      title: "tail",
      duration: tail,
      sectionType: "TAIL",
    });
    this.setState(() => ({
      metadata: metadata,
    }));
  };
  playVideos = () => {
    const metadata = this.state.metadata;
    console.log(metadata);
    let timer = setInterval(() => {
      let current_section = metadata[this.state.section_index];
      this.setState((prevState) => {
        return {
          count: prevState.count + 1,
          current_duration: prevState.current_duration + 1000,
        };
      });
      if (this.state.current_duration > current_section.duration) {
        this.setState((prevState) => {
          return {
            section_index: prevState.section_index + 1,
            current_duration: 1000,
            countdown: 3,
            countdownFlag: false,
          };
        });
        if (this.state.section_index < this.state.metadata.length) {
          current_section = metadata[this.state.section_index];
        }
      }

      if (this.state.current_duration == 1000) {
        this.setState(() => ({
          title: current_section.title,
          subtitle: current_section.subtitle ? current_section.subtitle : "",
          maintain_time: Math.min(
            this.state.maintain_time,
            current_section.duration
          ),
        }));
      }
      if (
        this.state.current_duration >
          current_section.duration - this.state.countdown * 1000 &&
        (current_section.sectionType == "HEAD" ||
          this.state.section_index == this.state.metadata.length - 2)
      ) {
        this.setState((prevState) => {
          return {
            countdownFlag: true,
            countdown: prevState.countdown - 1,
          };
        });
      }
      if (
        this.state.current_duration >= this.state.maintain_time &&
        current_section.sectionType != "HEAD" &&
        current_section.sectionType != "TAIL"
      ) {
        this.setState(() => ({
          title: "",
        }));
      }
      if (this.state.section_index > this.state.metadata.length) {
        clearInterval(timer);
        this.setState(() => ({
          count: 0,
          current_duration: 0,
          section_index: 0,
          current_section: {},
          countdown: 3,
          countdownFlag: false,
          title: "",
          subtitle: "",
        }));
      }
    }, 1000);
  };

  render() {
    return (
      <div className="player_container">
        <div className="video_container">
          <h1>{this.state.title}</h1>
          <h1>{this.state.subtitle}</h1>
          {this.state.count !== 0 && <div>playing: {this.state.count}</div>}
          {this.state.countdownFlag && <div>{this.state.countdown + 1}</div>}
        </div>
        <button onClick={this.playVideos}>Play</button>
      </div>
    );
  }
}

export default Player;
