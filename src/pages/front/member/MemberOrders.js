import { Table } from "react-bootstrap"

export default function MemberOrders(){
    return (<>
     <h3>訂單資料</h3>
     <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>訂單號</th>
          <th>訂單日</th>
          <th>訂單金額</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>

      </tbody>
    </Table>
    </>
    )
}