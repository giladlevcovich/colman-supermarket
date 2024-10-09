$(document).ready(function() {
  const apiUrl = 'http://localhost:80/api';
  const getSuppliers = 'suppliers'
  let editingSupplierId = null;
  let currentSuppliers = []


  function fetchSuppliers(name = '') {
      $.ajax({
          url: `${apiUrl}/${getSuppliers}?name=${name}`,
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


  $('#searchSupplier').on('keyup', function() {
    const query = $(this).val();
    fetchSuppliers(query);
  });


  fetchSuppliers();

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
          $.ajax({
              url: `${apiUrl}/updateSupplier/${editingSupplierId}`,
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
          $.ajax({
            url: `${apiUrl}/supplier`,
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

  $(document).on('click', '.edit-supplier', function() {
      const supplierId = $(this).data('id');
      $.ajax({
          url: `${apiUrl}/supplier/${supplierId}`,
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

  $('#cancelEditBtn').click(function() {
      $('#supplierForm')[0].reset();
      $('#formTitle').text('Add New Supplier');
      $('#formSubmitBtn').text('Save Supplier');
      $('#cancelEditBtn').hide();
      editingSupplierId = null;
  });

  $(document).on('click', '.delete-supplier', function() {
      const supplierId = $(this).data('id');
      if (confirm('Are you sure you want to delete this supplier?')) {
          $.ajax({
              url: `${apiUrl}/supplier/${supplierId}`,
              method: 'DELETE',
              success: function() {
                  fetchSuppliers();
              }
          });
      }
  });
});

function navigateTo(page) {
    window.location.href = page;
}
