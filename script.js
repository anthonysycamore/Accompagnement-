const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxqb41E7aZXPzll0fjPo4CURh2r3BvOsx_RzCP4PL1tN7LZf_5FqBBLKoL3d2PkAaZw/exec'; // replace with your actual deployed script URL

function fetchBookings() {
  fetch(WEB_APP_URL)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('booking-list');
      list.innerHTML = '';
      data.filter(b => b.Status === "Booked").forEach(b => {
        const div = document.createElement('div');
        div.className = 'booking';
        div.innerHTML = `
          <strong>${b.Date}</strong> at <strong>${b.Time}</strong> —
          ${b.Name} (${b.Role}, ${b.Duration} min) - ${b.Notes || "No notes"}
          <button onclick="cancelBooking('${b.Date}', '${b.Time}', '${b.Name}')">Cancel</button>
        `;
        list.appendChild(div);
      });
    });
}

function cancelBooking(date, time, name) {
  fetch(WEB_APP_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'cancel', date, time, name }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json())
    .then(response => {
      if (response.success) fetchBookings();
      else alert('Could not cancel booking: ' + response.error);
    });
}

document.getElementById('booking-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    action: 'book',
    date: formData.get('date'),
    time: formData.get('time'),
    name: formData.get('name'),
    role: formData.get('role'),
    duration: parseInt(formData.get('duration')),
    notes: formData.get('notes')
  };
	alert(JSON.stringify(data));

  fetch(WEB_APP_URL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json())
    .then(response => {
      if (response.success) {
        alert('Booking confirmed!');
        fetchBookings();
      } else {
        alert('Booking failed: ' + response.error);
      }
    });
});

fetchBookings();
