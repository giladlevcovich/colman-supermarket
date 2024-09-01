$(document).ready(function() {
  const apiUrl = 'http://localhost:80/supplier'; // Replace with your actual backend API URL
  const getSuppliers = 'suppliers'
  let editingSupplierId = null;
  let currentSuppliers = []

  // Function to fetch suppliers and populate the table
  function fetchSuppliers() {
      $.ajax({
          url: `${apiUrl}/${getSuppliers}`,
          method: 'GET',
          success: function(suppliers) {
              currentSuppliers = suppliers;
              $('#supplierTableBody').empty();
              currentSuppliers.forEach(supplier => {
                  $('#supplierTableBody').append(`
                      <tr>
                          <td>${supplier.name}</td>
                          <td>${supplier.contact.phone || ''}<br>${supplier.contact.email || ''}</td>
                          <td>${supplier.address.street || ''}, ${supplier.address.city || ''}, ${supplier.address.state || ''}</td>
                          <td>${supplier.location.lat}, ${supplier.location.lng}</td>
                          <td>${supplier.businessType || ''}</td>
                          <td>
                              <button class="btn btn-warning btn-sm edit-supplier" data-id="${supplier._id}">Edit</button>
                              <button class="btn btn-danger btn-sm delete-supplier" data-id="${supplier._id}">Delete</button>
                          </td>
                      </tr>
                  `);
              });
          }
      });
  }

  // Fetch suppliers when the page loads
  fetchSuppliers();

  // Handle form submission for adding/updating suppliers
  $('#supplierForm').submit(function(event) {
      event.preventDefault();

      const supplierData = {
          name: $('#name').val(),
          contact: {
              phone: $('#phone').val(),
              email: $('#email').val()
          },
          address: {
              street: $('#street').val(),
              city: $('#city').val(),
              state: $('#state').val()
          },
          location: {
              lat: parseFloat($('#lat').val()),
              lng: parseFloat($('#lng').val())
          },
          businessType: $('#businessType').val()
      };

      if (editingSupplierId) {
          // Update supplier
          $.ajax({
              url: `${apiUrl}/suppliers/${editingSupplierId}`,
              method: 'PUT',
              data: JSON.stringify(supplierData),
              contentType: 'application/json',
              success: function() {
                  fetchSuppliers();
                  $('#supplierForm')[0].reset();
                  $('#formTitle').text('Add New Supplier');
                  $('#formSubmitBtn').text('Save Supplier');
                  $('#cancelEditBtn').hide();
                  editingSupplierId = null;
              }
          });
      } else {
          // Create new supplier
          $.ajax({
              url: apiUrl, // TODO: inplement the add supplier route
              method: 'POST',
              data: JSON.stringify(supplierData),
              contentType: 'application/json',
              success: function() {
                  fetchSuppliers();
                  $('#supplierForm')[0].reset();
              }
          });
      }
  });

  // Handle edit button click
  $(document).on('click', '.edit-supplier', function() {
      const supplierId = $(this).data('id');
      $.ajax({
          url: `${apiUrl}/suppliers/${supplierId}`,
          method: 'GET',
          success: function(supplier) {
              editingSupplierId = supplier._id;
              $('#name').val(supplier.name);
              $('#phone').val(supplier.contact.phone || '');
              $('#email').val(supplier.contact.email || '');
              $('#street').val(supplier.address.street || '');
              $('#city').val(supplier.address.city || '');
              $('#state').val(supplier.address.state || '');
              $('#lat').val(supplier.location.lat);
              $('#lng').val(supplier.location.lng);
              $('#businessType').val(supplier.businessType || '');

              $('#formTitle').text('Edit Supplier');
              $('#formSubmitBtn').text('Update Supplier');
              $('#cancelEditBtn').show();
          }
      });
  });

  // Handle cancel edit button click
  $('#cancelEditBtn').click(function() {
      $('#supplierForm')[0].reset();
      $('#formTitle').text('Add New Supplier');
      $('#formSubmitBtn').text('Save Supplier');
      $('#cancelEditBtn').hide();
      editingSupplierId = null;
  });

  // Handle delete button click
  $(document).on('click', '.delete-supplier', function() {
      const supplierId = $(this).data('id');
      if (confirm('Are you sure you want to delete this supplier?')) {
          $.ajax({
              url: `${apiUrl}/${supplierId}`,
              method: 'DELETE',
              success: function() {
                  fetchSuppliers();
              }
          });
      }
  });
});
