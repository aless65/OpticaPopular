import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
// utils
import { fCurrency } from '../../../utils/formatNumber';
import { fDate } from '../../../utils/formatTime';
//
import styles from '../invoice/details/InvoiceStyle';

// ----------------------------------------------------------------------

InvoicePDF.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default function InvoicePDF({ invoice }) {
  const {
    items,
    taxes,
    status,
    dueDate,
    discount,
    invoiceTo,
    createDate,
    totalPrice,
    invoiceFrom,
    invoiceNumber,
    subTotalPrice,
  } = invoice;

  const [fechaActual, setFechaActual] = useState(new Date());
  
  const [infoCitas, setInfoCitas] = useState([]);

  useEffect(() => {
    fetch(`http://opticapopular.somee.com/api/Citas/BuscarCitasTerminadas/0`)
      .then(response => response.json())
      .then(data => {
        // const optionsData = data.data.map(item => ({
        //   label: item.muni_Nombre, // replace 'name' with the property name that contains the label
        //   id: item.muni_id // replace 'id' with the property name that contains the ID
        // }));
        // setOptionsMunicipios(optionsData);
        console.log(data.data);
        setInfoCitas(data.data);
      })
      .catch(error => console.error(error));

  }, [])


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image source={'https://i.ibb.co/MS2k400/Imagen-de-Whats-App-2023-05-13-a-las-08-13-37.jpg'} style={{ height: 100 }} />
          <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Text style={styles.h3}>Citas finalizadas</Text>
            <Text> { fDate(fechaActual) } </Text>
          </View>
        </View>

        <Text style={[styles.overline, styles.mb8]}>Detalles de citas</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Cliente</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Consultorio</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Sucursal</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Fecha y hora de inicio</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Hora final</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            {infoCitas.map((item, index) => (
              <View style={styles.tableRow} key={item.deci_Id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  {/* <Text style={styles.subtitle2}>{item.title}</Text> */}
                  <Text>{`${item.clie_Nombres} ${item.clie_Apellidos}`}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text>{item.cons_Nombre}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text>{item.sucu_Descripcion}</Text>
                </View>

                <View style={[styles.tableCell_2]}>
                  <Text>{`${fDate(item.cita_Fecha)} ${item.deci_HoraInicio}`}</Text>
                </View>

                <View style={[styles.tableCell_2]}>
                  <Text>{item.deci_HoraFin}</Text>
                </View>
              </View>
            ))}

            {/* <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Subtotal</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(subTotalPrice)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Discount</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(-discount)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Taxes</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(taxes)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text style={styles.h4}>Total</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.h4}>{fCurrency(totalPrice)}</Text>
              </View>
            </View> */}
          </View>
        </View>

        <View style={[styles.gridContainer, styles.footer]}>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>NOTAS</Text>
            <Text>Esdra, le juro que nos hemos esforzado al 101% pipipi</Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>¿Tienes preguntas?</Text>
            <Text>chingasa@tumadre.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
