const feedbackData = [
    { id: 1, user: "user1@mail.com", feedback: "Love the Rashi guidance!", status: "Pending" },
    { id: 2, user: "user2@mail.com", feedback: "Bug in chatbot.", status: "Fixed" },
  ];
  
  export default function FeedbackTable() {
    return (
      <div className="bg-neutral-800/80 p-6 rounded-2xl shadow overflow-x-auto">
        <h3 className="text-lg font-bold mb-4">📩 User Feedback</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="text-orange-400">
              <th>User</th>
              <th>Feedback</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.map((item) => (
              <tr key={item.id} className="border-t border-gray-700">
                <td>{item.user}</td>
                <td>{item.feedback}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  