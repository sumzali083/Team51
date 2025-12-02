import Feedback from "./feedback-react.js";

export default function feedbackPageRoute(appRoot, navigate) {
  ReactDOM.render(
    React.createElement(Feedback, { onNavigate: navigate }),
    appRoot
  );
}
