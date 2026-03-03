import { useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";
const PaymentSuccess = () => {
    const navigate = useNavigate() 

    return( 
        <div className="success-page">
            <div className="success-card">
                <div className="check-icon">✓</div>

                <h2>Your order is confirmed!</h2>
                <p>Thank you for your purchase. You can continue shopping below.</p>
                <button onClick={() => navigate("/")}>
                  Continue shopping
                </button>
            </div> 
        </div>
    );
};
export default PaymentSuccess;