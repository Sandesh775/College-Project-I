// --- MOCK STATE DATA ---
let services = [
  {
    id: 1,
    name: "Hydra Facial & Glow",
    price: 2500,
    desc: "Deep cleansing and skin rejuvenation treatment.",
  },
  {
    id: 2,
    name: "Hair Cut & Keratin Care",
    price: 1800,
    desc: "Professional hair makeover with keratin nourishing.",
  },
  {
    id: 3,
    name: "Gel Manicure & Pedicure",
    price: 1500,
    desc: "Complete nail care with long-lasting gel polish.",
  },
];

let staff = [
  { id: 1, name: "Aayusha K." },
  { id: 2, name: "Pooja M." },
];

let appointments = [
  {
    refId: "LX-8921",
    customerName: "Sujata Rai",
    serviceId: 1,
    serviceName: "Hydra Facial & Glow",
    price: 2500,
    staffName: "Aayusha K.",
    dateTime: "2026-07-26T14:00",
    status: "Confirmed",
  },
];

// --- VIEW SWITCHING ---
function switchView(view) {
  document
    .querySelectorAll(".nav-tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".view-panel")
    .forEach((panel) => panel.classList.remove("active"));

  if (view === "customer") {
    document.querySelectorAll(".nav-tab")[0].classList.add("active");
    document.getElementById("customerView").classList.add("active");
  } else {
    document.querySelectorAll(".nav-tab")[1].classList.add("active");
    document.getElementById("adminView").classList.add("active");
  }
  renderAll();
}

// --- MODAL UTILITIES ---
function openModal(id) {
  document.getElementById(id).classList.add("active");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

// --- RENDER LOGIC ---
function renderAll() {
  renderCustomerServices();
  renderCustomerBookings();
  renderAdminAppointments();
  renderAdminMetrics();
}

function renderCustomerServices() {
  const container = document.getElementById("customerServiceGrid");
  container.innerHTML = services
    .map(
      (s) => `
        <div class="service-card">
          <div>
            <h3>${s.name}</h3>
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem;">${s.desc}</p>
          </div>
          <div>
            <div class="service-price">NPR ${s.price.toLocaleString()}</div>
            <button class="btn btn-primary" style="width: 100%; justify-content: center;" onclick="openBookingModal(${s.id})">
              Book Appointment
            </button>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderCustomerBookings() {
  const tbody = document.getElementById("customerBookingTable");
  if (appointments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No bookings found.</td></tr>`;
    return;
  }
  tbody.innerHTML = appointments
    .map(
      (a) => `
        <tr>
          <td><strong>${a.refId}</strong></td>
          <td>${a.serviceName}</td>
          <td>${new Date(a.dateTime).toLocaleString()}</td>
          <td><span class="badge badge-${a.status.toLowerCase()}">${a.status}</span></td>
          <td>
            ${
              a.status !== "Cancelled" && a.status !== "Completed"
                ? `<button class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="cancelBooking('${a.refId}')">Cancel</button>`
                : "-"
            }
          </td>
        </tr>
      `,
    )
    .join("");
}

function renderAdminAppointments() {
  const tbody = document.getElementById("adminAppointmentsTable");
  tbody.innerHTML = appointments
    .map(
      (a) => `
        <tr>
          <td><strong>${a.refId}</strong></td>
          <td>${a.customerName}</td>
          <td>${a.serviceName}</td>
          <td>${a.staffName || "Unassigned"}</td>
          <td>${new Date(a.dateTime).toLocaleString()}</td>
          <td><span class="badge badge-${a.status.toLowerCase()}">${a.status}</span></td>
          <td>
            <select class="form-control" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;" onchange="updateStatus('${a.refId}', this.value)">
              <option value="Pending" ${a.status === "Pending" ? "selected" : ""}>Pending</option>
              <option value="Confirmed" ${a.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
              <option value="Completed" ${a.status === "Completed" ? "selected" : ""}>Completed</option>
              <option value="Cancelled" ${a.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
          </td>
        </tr>
      `,
    )
    .join("");
}

function renderAdminMetrics() {
  document.getElementById("metricBookingsCount").innerText =
    appointments.length;

  const revenue = appointments
    .filter((a) => a.status === "Completed" || a.status === "Confirmed")
    .reduce((sum, a) => sum + a.price, 0);

  document.getElementById("metricRevenue").innerText =
    `NPR ${revenue.toLocaleString()}`;
  document.getElementById("metricStaffCount").innerText = staff.length;
}

// --- ACTIONS ---

// Customer Actions
function openBookingModal(serviceId) {
  const service = services.find((s) => s.id === serviceId);
  document.getElementById("bookServiceId").value = service.id;
  document.getElementById("bookServiceName").value =
    `${service.name} (NPR ${service.price})`;
  openModal("bookingModal");
}

function handleCustomerBooking(e) {
  e.preventDefault();
  const serviceId = parseInt(document.getElementById("bookServiceId").value);
  const service = services.find((s) => s.id === serviceId);
  const customerName = document.getElementById("bookCustomerName").value;
  const dateTime = document.getElementById("bookDateTime").value;

  const newBooking = {
    refId: "LX-" + Math.floor(1000 + Math.random() * 9000),
    customerName: customerName,
    serviceId: service.id,
    serviceName: service.name,
    price: service.price,
    staffName: staff[0] ? staff[0].name : "Unassigned",
    dateTime: dateTime,
    status: "Pending",
  };

  appointments.push(newBooking);
  closeModal("bookingModal");
  document.getElementById("bookingForm").reset();
  renderAll();
  alert(`Booking Successful! Your Reference ID is: ${newBooking.refId}`);
}

function cancelBooking(refId) {
  const appt = appointments.find((a) => a.refId === refId);
  if (appt && confirm("Are you sure you want to cancel this booking?")) {
    appt.status = "Cancelled";
    renderAll();
  }
}

// Admin Actions
function openWalkInModal() {
  const serviceSelect = document.getElementById("walkInServiceSelect");
  serviceSelect.innerHTML = services
    .map((s) => `<option value="${s.id}">${s.name} - NPR ${s.price}</option>`)
    .join("");

  const staffSelect = document.getElementById("walkInStaffSelect");
  staffSelect.innerHTML = staff
    .map((st) => `<option value="${st.name}">${st.name}</option>`)
    .join("");

  openModal("walkInModal");
}

function handleWalkInBooking(e) {
  e.preventDefault();
  const serviceId = parseInt(
    document.getElementById("walkInServiceSelect").value,
  );
  const service = services.find((s) => s.id === serviceId);

  const newBooking = {
    refId: "LX-" + Math.floor(1000 + Math.random() * 9000),
    customerName: document.getElementById("walkInName").value + " (Walk-In)",
    serviceId: service.id,
    serviceName: service.name,
    price: service.price,
    staffName: document.getElementById("walkInStaffSelect").value,
    dateTime: document.getElementById("walkInDateTime").value,
    status: "Confirmed",
  };

  appointments.push(newBooking);
  closeModal("walkInModal");
  document.getElementById("walkInForm").reset();
  renderAll();
}

function handleAddService(e) {
  e.preventDefault();
  const name = document.getElementById("newServiceName").value;
  const price = parseFloat(document.getElementById("newServicePrice").value);
  const desc = document.getElementById("newServiceDesc").value;

  services.push({ id: Date.now(), name, price, desc });
  closeModal("serviceModal");
  renderAll();
}

function openStaffModal() {
  renderStaffList();
  openModal("staffModal");
}

function renderStaffList() {
  const container = document.getElementById("staffListContainer");
  container.innerHTML = staff
    .map(
      (st) => `
        <li style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-input); padding: 0.5rem 1rem; border-radius: 8px;">
          <span>${st.name}</span>
          <button class="btn btn-danger" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="removeStaff(${st.id})">Remove</button>
        </li>
      `,
    )
    .join("");
}

function handleAddStaff(e) {
  e.preventDefault();
  const input = document.getElementById("newStaffName");
  staff.push({ id: Date.now(), name: input.value });
  input.value = "";
  renderStaffList();
  renderAdminMetrics();
}

function removeStaff(id) {
  staff = staff.filter((st) => st.id !== id);
  renderStaffList();
  renderAdminMetrics();
}

function updateStatus(refId, newStatus) {
  const appt = appointments.find((a) => a.refId === refId);
  if (appt) {
    appt.status = newStatus;
    renderAll();
  }
}

// Initial Initialization
renderAll();
