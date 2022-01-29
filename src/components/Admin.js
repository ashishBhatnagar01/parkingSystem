import Card from "react-bootstrap/Card"
function Admin(){
    return(
        <div>
            <Card style={{ width: '25rem' ,height:'10rem',  background: "linear-gradient(to right, #e1eec3, #f05053)"}} className="mt-5">
              <Card.Body>
                <Card.Title className="text-center p-5" style={{fontSize:"30px",cursor:"pointer"}}>Admin Panel</Card.Title>
              </Card.Body>
            </Card>
        </div>
    )
}
export default Admin;