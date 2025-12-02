export default function Feedback(props) {
  const React = window.React;
  const axios = window.axios;

  const { useState, useRef } = React;

  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const timer = useRef(null);

  function showAlert(type, text) {
    setAlert({ type, text });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAlert(null), 4000);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!comment.trim()) {
      showAlert("danger", "Comment is required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/feedback", {
        userId: null,
        productId: null,
        rating: Number(rating),
        comment: comment.trim(),
      });

      showAlert("success", res.data.message || "Feedback submitted!");

      setRating("5");
      setComment("");
    } catch (err) {
      showAlert(
        "danger",
        err?.response?.data?.message || "Server error. Please try again."
      );
    }

    setLoading(false);
  }

  return React.createElement(
    "main",
    { className: "container mt-5", style: { maxWidth: 900 } },

    React.createElement(
      "div",
      { className: "p-4 bg-white rounded shadow-sm" },

      React.createElement(
        "div",
        { className: "d-flex justify-content-between align-items-center mb-3" },
        React.createElement("h2", null, "Leave Feedback"),
        React.createElement(
          "button",
          { className: "btn btn-link", onClick: (e) => props.onNavigate(e, "home") },
          "← Back Home"
        )
      ),

      alert &&
        React.createElement(
          "div",
          { className: `alert alert-${alert.type}`, role: "alert" },
          alert.text
        ),

      React.createElement(
        "form",
        { onSubmit: handleSubmit },

        // Rating
        React.createElement(
          "div",
          { className: "mb-3" },
          React.createElement("label", { className: "form-label" }, "Rating"),
          React.createElement(
            "select",
            {
              className: "form-select",
              value: rating,
              onChange: (e) => setRating(e.target.value),
            },
            React.createElement("option", { value: "5" }, "5 - Excellent"),
            React.createElement("option", { value: "4" }, "4 - Good"),
            React.createElement("option", { value: "3" }, "3 - Average"),
            React.createElement("option", { value: "2" }, "2 - Poor"),
            React.createElement("option", { value: "1" }, "1 - Terrible")
          )
        ),

        // Comment
        React.createElement(
          "div",
          { className: "mb-3" },
          React.createElement("label", { className: "form-label" }, "Comment"),
          React.createElement("textarea", {
            className: "form-control",
            rows: 5,
            value: comment,
            onChange: (e) => setComment(e.target.value),
            placeholder: "Share your thoughts...",
          })
        ),

        // Submit button
        React.createElement(
          "button",
          { className: "btn btn-dark", type: "submit", disabled: loading },
          loading ? "Submitting..." : "Submit Feedback"
        )
      )
    )
  );
}
