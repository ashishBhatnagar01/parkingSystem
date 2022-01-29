import Card from "react-bootstrap/Card"
import React from "react"
import swal from "sweetalert"
import axios from "axios"
function Exit(){
    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }
    async function displayRazorpay(charge) {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const result = await axios.post("https://parking-backend-b.herokuapp.com/payOnline",{charge:charge});

        if (!result) {
            alert("Server error. Are you online?");
            return;
        }

        const { amount, id: order_id, currency } = result.data;

        const options = {
            key: "rzp_test_jXISS5tCVQuHEl", // Enter the Key ID generated from the Dashboard
            amount: amount.toString(),
            currency: currency,
            name: "Ashish Bhatnagar",
            description: "Parking Fees",
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };

                const result = await axios.post("https://parking-backend-b.herokuapp.com/payOnline", data);

                console.log(result.data);
            },
            prefill: {
                name: "Ashish Bhatnagar",
                email: "bhatnagarashish16@gmail.com",
                contact: "9667041880",
            },
            theme: {
                color: "black",
            },

        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }
     function exitPopup(){
        swal({
            title:"Enter vehicle number!",
            content:"input",
            buttons:"Submit!"
        }).then(async(value)=>{
            // console.log(value)
            const response=await axios.post('https://parking-backend-b.herokuapp.com/exit',{vehicleNo:value})
            // console.log(response)
            if(response.data.notFound==true){
                swal({
                    title:"Vehicle not found in the parking!",
                    icon:"warning",
                    buttons:"Okay"
                })
            }
            else{
                swal({
                    title:`Total Charge: ${response.data.charge}`,
                    text:`Entry Time: ${response.data.entryTime}\n\n Exit Time: ${response.data.exitTime} \n\n Duration: ${response.data.duration} minutes`,
                    icon:"success",
                    buttons:["Cash","Online"]
                }).then((value)=>{
                    if(value!=null){
                    displayRazorpay(response.data.charge)
                    }
                })
                document.getElementById(response.data.slot).style.backgroundColor="#4ade80"
            }

        })
    }
    return(
        <div>
            <Card style={{ width: '25rem' ,height:'10rem', background: "linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)"}} className="mt-5" onClick={exitPopup}>
              <Card.Body>
                <Card.Title className="text-center p-5" style={{fontSize:"30px",cursor:"pointer"}}>Exit Gate</Card.Title>
              </Card.Body>
            </Card>
        </div>
    )
} 
export default Exit;