<script
src="https://cdn.jsdelivr.net/npm/sweetalert2@10.16.7/dist/sweetalert2.min.js"></script>

<script
src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<script
src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script
src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

<script>






// Function to fetch booking data and display it in the desired format
async function fetchBookingData() {
  try {
      // Fetch data from the backend (booking list API)
      const response = await fetch('http://localhost:8081/Akshay/Bookinglist');

      // Check if the response is OK
      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      // Parse the JSON data from the response
      const data = await response.json();
      const bookingList = document.querySelector('#bookingList');
      bookingList.innerHTML = ''; // Clear existing data

      // Loop through the data and create list items for each booking
      data.forEach((item, index) => {
          const listItem = document.createElement('li');
          listItem.classList.add('roles-item', 'flex');
          listItem.setAttribute('data-id', item.id); // Add data-id attribute to identify booking by ID

          listItem.innerHTML = `
<div class="body-text">${index + 1}</div>
<div class="body-text">${item.project_type || 'N/A'}</div>
<div class="body-text">${item.project_id || 'N/A'}</div>
<div class="body-text">${item.property_name || 'N/A'}</div>
<div class="body-text">${item.property_no || 'N/A'}</div>
<div class="body-text">${item.location || 'N/A'}</div>
<div class="body-text">${item.individual_applicant_name || 'N/A'}</div>
<div class="body-text">${item.broker_name || 'N/A'}</div>
<div class="body-text">${item.purchase_date || 'N/A'}</div>
<div class="body-text">${item.grand_total_amount || 'N/A'}</div>
<div class="list-icon-function flex flex-wrap">
<!-- Actions Dropdown -->
<div class="dropdown">
<button class="btn btn-secondary btn-lg dropdown-toggle" type="button" id="dropdownMenuButton${item.id}" data-bs-toggle="dropdown" aria-expanded="false">
Actions
</button>
<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${item.id}">
<li>
<a class="dropdown-item" href="javascript:void(0);" onclick="showWelcomeLetterForm(${item.id})">
<i class="fas fa-file-alt"></i> Welcome Letter
</a>
</li>
<li>
<a class="dropdown-item" href="javascript:void(0);" onclick="invoice(${item.id})">
<i class="fas fa-receipt"></i> Invoice
</a>
</li>
<li>
<a class="dropdown-item" href="javascript:void(0);" onclick="editBooking(${JSON.stringify(item)})">
<i class="fas fa-pencil-alt"></i> Edit Booking
</a>
</li>
<li>
<a class="dropdown-item" href="javascript:void(0);" onclick="deleteBooking(${item.id})">
<i class="fas fa-trash"></i> Delete Booking
</a>
</li>
<li>
<a class="dropdown-item" href="javascript:void(0);" onclick="showEmailForm(${item.id})">
<i class="fas fa-envelope"></i> Send Email
</a>
</li>
<li>
<a class="dropdown-item" href="javascript:void(0);" onclick="sendWhatsAppMessage(${item.id})">
<i class="fab fa-whatsapp"></i> WhatsApp
</a>
</li>
</ul>
</div>
</div>`;
          bookingList.appendChild(listItem);
      });
  } catch (error) {
      console.error('Error fetching booking data:', error);
  }
}





// Delete booking functionality
async function deleteBooking(bookingId) {
  const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
      try {
          // Send DELETE request to the backend
          const response = await fetch(`http://localhost:8081/Akshay/Bookinglist?id=${bookingId}`, {
              method: 'DELETE',
          });

          if (response.ok) {
              // Remove the booking from the list on success without a full page refresh
              const bookingElement = document.querySelector(`#bookingList li[data-id="${bookingId}"]`);
              if (bookingElement) {
                  bookingElement.remove(); // Immediately remove from the DOM
              }
              Swal.fire(
                  'Deleted!',
                  'Your booking has been deleted.',
                  'success'
              );
          } else {
              Swal.fire(
                  'Failed!',
                  'Failed to delete the booking.',
                  'error'
              );
          }
      } catch (error) {
          console.error('Error deleting booking:', error);
          Swal.fire(
              'Error!',
              'An error occurred while deleting the booking. Please try again later.',
              'error'
          );
      }
  }
}






// Show Welcome Letter form as a popup
function showWelcomeLetterForm(bookingId) {
  // Fetch booking details including broker_name from the backend
  fetch(`http://localhost:8081/Akshay/Bookinglist?id=${bookingId}`)
      .then(response => response.json())
      .then(data => {
          const broker_name = data.broker_name || 'N/A'; // Get broker_name from the response

          const popupForm = document.createElement('div');
          popupForm.classList.add('popup-form');

          popupForm.innerHTML = `
<div class="popup-content">
<h3>Welcome Letter</h3>
<form id="welcomeLetterForm">
<label for="applicantName">Name:</label>
<input type="text" id="applicantName" name="applicantName" placeholder="Enter applicant name" required>
<label for="applicantPosition">Position:</label>
<input type="text" id="applicantPosition" name="applicantPosition" placeholder="Enter position" required>
<button type="button" class="download-pdf-btn" onclick="downloadPDF('${broker_name}')">Download PDF</button>
</form>
</div>
`;

          document.body.appendChild(popupForm);

          // Close the form if clicking outside the popup
          popupForm.addEventListener('click', function (event) {
              if (event.target === popupForm) {
                  popupForm.remove();
              }
          });
      })
      .catch(error => {
          console.error('Error fetching booking details:', error);
          alert('Failed to load booking details.');
      });
}







// Download PDF functionality using jsPDF library
function downloadPDF(broker_name) {
  const name = document.getElementById('applicantName').value;
  const position = document.getElementById('applicantPosition').value;

  // Check if both fields are filled
  if (!name || !position) {
      alert("Please fill in all the required fields before generating the PDF.");
      return; // Stop further execution if fields are empty
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const date = new Date().toLocaleDateString();

  // Add content to the PDF
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 139); // Dark blue color for the heading
  doc.text('Welcome to Gyansheela Developers', 105, 20, null, null, 'center');

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Date: ${date}`, 180, 30, null, null, 'right');

  doc.text(`Dear ${broker_name},`, 10, 50);  // Add broker_name after "Dear"
  doc.text('We warmly welcome you to the Gyansheela family! Congratulations on booking your new residence at our upcoming residential township. Your decision to invest in our community fills us with immense pride and joy.', 10, 70, { maxWidth: 180 });

  doc.text('At Gyansheela Developers Ltd., we are committed to creating not just residences, but vibrant, thriving communities where families can grow, friendships can flourish, and memories can be cherished for a lifetime. Our township is thoughtfully designed to cater to all your needs, blending the charm of serene residential plots for villas with the convenience and luxury of a modern township.', 10, 90, { maxWidth: 180 });

  doc.text('We take immense pride in being Indore\'s most premium real estate developers, known for our focus on economical spaces without compromising on quality and comfort. Your new home will be part of a meticulously planned township that offers the perfect balance of privacy and community living.', 10, 130, { maxWidth: 180 });

  doc.text('We abide by all government rules and regulations and encourage everyone to join us in creating a stronger and more cohesive community.', 10, 170, { maxWidth: 180 });

  doc.text('Our team is dedicated to providing you with all the support and assistance you need during the construction process and beyond. We are here to ensure that your experience with Gyansheela is nothing short of exceptional.', 10, 190, { maxWidth: 180 });

  doc.text('Thank you once again for trusting Gyansheela Developers Ltd. with your new home. We look forward to welcoming you and your family to our growing community and witnessing the joyous moments that lie ahead.', 10, 210, { maxWidth: 180 });

  doc.text('Should you have any questions or need further assistance, please do not hesitate to reach out to us at 62872**1662. We are always here to help.', 10, 250, { maxWidth: 180 });

  doc.text('Warmest regards,', 10, 270, { maxWidth: 180 });
  doc.text(name, 10, 280, { maxWidth: 180 });
  doc.text(position, 10, 290, { maxWidth: 180 });
  doc.text('Gyansheela Developers Ltd.', 10, 300, { maxWidth: 180 });
  doc.text('https://gyansheela.geegatech.online', 10, 310, { maxWidth: 180 });

  // Save the PDF and trigger the download
  doc.save('welcome_letter.pdf');

  // Close the popup after download
  document.querySelector('.popup-form').remove();
}






// Edit booking functionality based on project_type
function editBooking(item) {
  try {
      // Create URLSearchParams from the object to pass all data as query parameters
      const queryParams = new URLSearchParams({
          id: item.id || '',
          project_type: item.project_type || '',
          property_name: item.property_name || '',
          property_name2: item.property_name2 || '',
          property_no: item.property_no || '',
          built_up_area: item.built_up_area || '',
          ownership_type: item.ownership_type || '',
          discount: item.discount || '',
          floor_number: item.floor_number || '',
          location_charges: item.location_charges || '',
          client_type: item.client_type || '',
          base_charges: item.base_charges || '',
          rate_per_sq_feet: item.rate_per_sq_feet || '',
          super_built_up_area: item.super_built_up_area || '',
          grand_total_amount: item.grand_total_amount || '',
          size: item.size || '',
          purchase_date: item.purchase_date || '',
          status: item.status || '',
          amenities: item.amenities || '',
          facing: item.facing || '',
          payment_id: item.payment_id || '',
          individual_applicant_name: item.individual_applicant_name || '',
          individual_applicant_address: item.individual_applicant_address || '',
          individual_applicant_city: item.individual_applicant_city || '',
          individual_applicant_email: item.individual_applicant_email || '',
          individual_applicant_gender: item.individual_applicant_gender || '',
          individual_applicant_whatsapp_number: item.individual_applicant_whatsapp_number || '',
          individual_applicant_contact_number: item.individual_applicant_contact_number || '',
          individual_applicant_pan_number: item.individual_applicant_pan_number || '',
          individual_applicant_aadhar_number: item.individual_applicant_aadhar_number || '',
          individual_applicant_gst_number: item.individual_applicant_gst_number || '',
          individual_applicant_passport_number: item.individual_applicant_passport_number || '',
          total_amount_with_charge: item.total_amount_with_charge || '',
          broker_name: item.broker_name || '',
          price_of_unit: item.price_of_unit || '',
          location: item.location || ''
      }).toString();  // Convert object to query string

      // Redirect to the corresponding page based on project_type
      if (item.project_type === "flat") {
          window.location.href = `flatbook.html?${queryParams}`;
      } else if (item.project_type === "plot") {
          window.location.href = `plotbook.html?${queryParams}`;
      } else if (item.project_type === "bungalow") {
          window.location.href = `BunglowBooK.html?${queryParams}`;
      }
  } catch (error) {
      console.error('Error redirecting to the edit page:', error);
      alert('An error occurred while redirecting to the edit page. Please try again later.');
  }
}





// Initialize EmailJS with your public key
emailjs.init('6MfX99cXhH1QfrUBL'); // Replace with your EmailJS public key

// Function to show success notification
function showSuccessNotification(message) {
  const notification = document.createElement('div');
  notification.classList.add('success-notification');
  notification.textContent = message;

  Object.assign(notification.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: '#006400', // Dark Green Color
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      zIndex: '1000',
      fontSize: '16px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      opacity: '1',
      transition: 'opacity 0.5s ease',
  });

  document.body.appendChild(notification);

  setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 500);
  }, 2000);
}



// Function to send email
async function sendEmail(toEmail) {
  if (!toEmail || toEmail === 'N/A') {
      alert('No valid email address found!');
      return; // Skip if email is invalid or not available
  }

  try {
      const response = await emailjs.send(
          'service_csqwqjz', // Your EmailJS service ID
          'template_lvm8ga9', // Your EmailJS template ID
          {
              from_email: 'your-email@example.com', // Replace with your sender email
              to_email: toEmail, // Recipient email
              subject: "Invoice for Your Booking", // Email subject
              message: "Hi, here is your invoice.", // Email body
          }
      );

      if (response.status === 200) {
          showSuccessNotification('Email sent successfully!');
      } else {
          alert('Failed to send the email. Please try again.');
      }
  } catch (error) {
      console.error('Error sending email:', error);
      alert('An error occurred while sending the email. Please try again later.');
  }
}






// Fetch booking data and render the list
async function fetchBookingData() {
  try {
      const response = await fetch('http://localhost:8081/Akshay/Bookinglist');

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      const bookingList = document.querySelector('#bookingList');
      bookingList.innerHTML = '';

      data.forEach((item, index) => {
          const listItem = document.createElement('li');
          listItem.classList.add('roles-item', 'flex');
          listItem.setAttribute('data-id', item.id);

          listItem.innerHTML = `
<div class="body-text">${index + 1}</div>
<div class="body-text">${item.project_type || 'N/A'}</div>
<div class="body-text">${item.project_id || 'N/A'}</div>
<div class="body-text">${item.property_name || 'N/A'}</div>
<div class="body-text">${item.property_no || 'N/A'}</div>
<div class="body-text">${item.location || 'N/A'}</div>
<div class="body-text">${item.individual_applicant_name || 'N/A'}</div>
<div class="body-text">${item.broker_name || 'N/A'}</div>
<div class="body-text">${item.purchase_date || 'N/A'}</div>
<div class="body-text">${item.grand_total_amount || 'N/A'}</div>
<div class="list-icon-function flex flex-wrap">
<div class="dropdown">
<button class="btn btn-secondary btn-lg dropdown-toggle" type="button" id="dropdownMenuButton82" data-bs-toggle="dropdown" aria-expanded="false">
Actions
</button>
<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton82">
<li>
<a class="dropdown-item" href="javascript:void(0);" onclick="sendEmail('${item.individual_applicant_email || 'N/A'}')">
<i class="fas fa-envelope"></i> Send Email
</a>
</li>
<li>
<a class="dropdown-item" href="javascript:void(0);" onclick="showWelcomeLetterForm(${item.id})">
<i class="fas fa-file-pdf"></i> Welcome Letter
</a>
</li>
<li>
<a class="dropdown-item" href="javascript:void(0);" onclick="invoice(${item.id})">
<i class="fas fa-envelope"></i> Invoice
</a>
</li>
<li>
<a class="dropdown-item" href="javascript:void(0);" onclick="editBooking({
id: '${item.id}',
project_type: '${item.project_type}',
property_name: '${item.property_name}',
property_no: '${item.property_no}',
location: '${item.location}',
individual_applicant_name: '${item.individual_applicant_name}',
broker_name: '${item.broker_name}',
purchase_date: '${item.purchase_date}',
grand_total_amount: '${item.grand_total_amount}',
individual_applicant_email: '${item.individual_applicant_email}'
})">
<i class="fas fa-pencil-alt"></i> Edit Booking
</a>
</li>
<li>
<a class="dropdown-item" href="javascript:void(0);" onclick="deleteBooking(${item.id})">
<i class="fas fa-trash"></i> Delete Booking
</a>
</li>
<li>
<a class="dropdown-item" href="javascript:void(0);" id="whatsappLink">
<i class="fas fa-whatsapp"></i> WhatsApp
</a>
</li>

</ul>
</div>
</div>`;

          bookingList.appendChild(listItem);
      });
  } catch (error) {
      console.error('Error fetching booking data:', error);
      alert('An error occurred while fetching the booking data.');
  }
}






async function invoice(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [600, 800],
  });

  const defaultData = {
      receiptDate: new Date().toISOString().split('T')[0], // Current date
      receiptNo: `2024-${Math.floor(Math.random() * 1000)}`, // Random receipt number
      panNo: data?.panNo || "N/A",
      customerName: data?.customerName || "ATUL NIGWAL",
      address: data?.address || "KHARGONE MADHYA PRADESH",
      mobileNo: data?.mobileNo || "N/A",
      gstNo: data?.gstNo || "782",
      customerId: data?.customerId || "9929",
      unitNo: data?.unitNo || "19",
      projectName: data?.projectName || "GYANSHILA",
      basePrice: data?.basePrice || "1000.00",
      locationCharges: data?.locationCharges || "190.00",
      discount: data?.discount || "7.00",
      bookingAmount: data?.bookingAmount || "1000.00",
      totalAmount: data?.totalAmount || "N/A",
      paymentStartDate: data?.paymentStartDate || "2010-12-02",
  };

  // Box and Header
  const boxX = 40, boxY = 40, boxWidth = 520, boxHeight = 700, padding = 20;
  doc.rect(boxX, boxY, boxWidth, boxHeight);

  const contentX = boxX + padding, contentY = boxY + padding;
  let y = contentY;

  // Header
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text("GYANSHEELA DEVELOPERS LTD.", boxX + boxWidth / 2, y, { align: "center" });
  y += 30;
  doc.setFontSize(14).text("INVOICE", boxX + boxWidth / 2, y, { align: "center" });

  // Customer and Receipt Details
  y += 40;
  doc.setFontSize(12).setFont("helvetica", "normal");
  doc.text(`Customer Name: ${defaultData.customerName}`, contentX, y);
  doc.text(`Address: ${defaultData.address}`, contentX, y + 20);
  doc.text(`Mobile No: ${defaultData.mobileNo}`, contentX, y + 40);
  doc.text(`GST No.: ${defaultData.gstNo}`, contentX, y + 60);

  doc.text(`RECEIPT DATE: ${defaultData.receiptDate}`, contentX + 260, y);
  doc.text(`RECEIPT No: ${defaultData.receiptNo}`, contentX + 260, y + 20);
  doc.text(`PAN NO: ${defaultData.panNo}`, contentX + 260, y + 40);
  doc.text(`Customer ID: ${defaultData.customerId}`, contentX + 260, y + 60);

  // Payment Details
  y += 100;
  doc.text(
      `Received with thanks a sum of Rs. ${defaultData.totalAmount} Vide RTGS/NEFT/IMPS No. 123456789 date: ${defaultData.receiptDate}, towards unit no. ${defaultData.unitNo} in Project ${defaultData.projectName}.`,
      contentX, y, { maxWidth: boxWidth - 2 * padding }
  );

  // Table Header
  y += 60;
  const headers = ["Base Selling Price", "Preferred Location Charges", "Discount", "Booking Amount", "Total Amount", "Payment Start Date"];
  const dataRow = [
      defaultData.basePrice,
      defaultData.locationCharges,
      defaultData.discount,
      defaultData.bookingAmount,
      defaultData.totalAmount,
      defaultData.paymentStartDate,
  ];
  const colWidths = [110, 110, 110, 110, 110, 110];

  let x = contentX;
  headers.forEach((header, i) => {
      doc.rect(x, y, colWidths[i], 25).text(header, x + 5, y + 17);
      x += colWidths[i];
  });

  // Table Data
  x = contentX;
  y += 25;
  dataRow.forEach((cell, i) => {
      doc.rect(x, y, colWidths[i], 25).text(String(cell), x + 5, y + 17);
      x += colWidths[i];
  });

  // Total Receipt Amount
  y += 40;
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL RECEIPT AMOUNT: Rs. ${defaultData.totalAmount}`, contentX, y);

  // Footer Notes
  y += 60;
  const notes = [
      "Thank you,",
      "M/S Gyansheela Developers Ltd.",
      "",
      "Authorised Signatory",
      "",
      "E&OE.",
      "1. The Receipt is subject to realization of Instrument.",
      "2. GST is charged as applicable.",
      "3. This Receipt is non-transferable without written consent of the Company.",
      "4. The customer liability towards the payment of dues shall be discharged on the date of credit of funds in the bank account of Gyansheela Developers Ltd.",
  ];
  notes.forEach((note, i) => {
      doc.setFont("helvetica", "normal").text(note, contentX, y + i * 20, { maxWidth: boxWidth - 2 * padding });
  });

  // Save the PDF
  doc.save("invoice.pdf");
}


function whatsappLink(phoneNumber, message) {
  if (!phoneNumber || phoneNumber === 'N/A') {
      showError("Phone number is not available.");
      return;
  }

  // Create the WhatsApp URL
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // Open the WhatsApp URL in a new tab or window
  window.open(url, '_blank').focus();

  // Show a temporary message if the action fails (simulated as not having WhatsApp installed)
  setTimeout(() => {
      showError("WhatsApp is not installed or not available.");
  }, 1000);
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.classList.add('error-message');
  errorDiv.textContent = message;

  // Style the error message
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '10px';
  errorDiv.style.right = '10px';
  errorDiv.style.backgroundColor = '#ff4d4d';
  errorDiv.style.color = 'white';
  errorDiv.style.padding = '10px';
  errorDiv.style.borderRadius = '5px';
  errorDiv.style.zIndex = '1000';

  // Add the error message to the document
  document.body.appendChild(errorDiv);

  // Remove the error message after 3 seconds
  setTimeout(() => {
      document.body.removeChild(errorDiv);
  }, 3000);
}




// Call the function to load data initially
fetchBookingData();

</script>
