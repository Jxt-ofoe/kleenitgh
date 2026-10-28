/**
 * KLEENIT GHANA LIMITED - ADMINISTRATOR DASHBOARD LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  // App Elements
  const appLoading = document.getElementById('app-loading');
  const viewLogin = document.getElementById('view-login');
  const viewDashboard = document.getElementById('view-dashboard');

  // Login Form Elements
  const loginForm = document.getElementById('admin-login-form');
  const usernameInput = document.getElementById('admin-username');
  const passwordInput = document.getElementById('admin-password');
  const btnTogglePassword = document.getElementById('btn-toggle-password');
  const btnLoginSubmit = document.getElementById('btn-login-submit');
  const loginAlert = document.getElementById('login-error-alert');
  const loginErrorMsg = document.getElementById('login-error-message');

  // Dashboard Elements
  const userDisplayName = document.getElementById('user-display-name');
  const userDisplayEmail = document.getElementById('user-display-email');
  const btnLogout = document.getElementById('btn-logout');
  const btnRefresh = document.getElementById('btn-refresh-data');

  // Stats Elements
  const statCards = document.querySelectorAll('.stat-card');
  const statTotal = document.getElementById('stat-total');
  const statNew = document.getElementById('stat-new');
  const statContacted = document.getElementById('stat-contacted');
  const statConfirmed = document.getElementById('stat-confirmed');
  const statCompleted = document.getElementById('stat-completed');
  const statCancelled = document.getElementById('stat-cancelled');

  // Filters & Search
  const filterSearch = document.getElementById('filter-search');
  const btnClearSearch = document.getElementById('btn-clear-search');
  const filterStatus = document.getElementById('filter-status');
  const filterService = document.getElementById('filter-service');
  const filterDate = document.getElementById('filter-date');
  const btnResetFilters = document.getElementById('btn-reset-filters');
  const activeFiltersBar = document.getElementById('active-filters-bar');
  const filterTags = document.getElementById('filter-tags');

  // Table & States
  const tableBody = document.getElementById('bookings-table-body');
  const tableLoading = document.getElementById('table-loading');
  const tableEmpty = document.getElementById('table-empty');
  const tableEmptyDesc = document.getElementById('table-empty-desc');
  const tableError = document.getElementById('table-error');
  const btnRetryTable = document.getElementById('btn-retry-table');

  // Pagination Elements
  const pageStartCount = document.getElementById('page-start-count');
  const pageEndCount = document.getElementById('page-end-count');
  const totalBookingsCount = document.getElementById('total-bookings-count');
  const btnPrevPage = document.getElementById('btn-prev-page');
  const btnNextPage = document.getElementById('btn-next-page');
  const currentPageNum = document.getElementById('current-page-num');
  const totalPagesNum = document.getElementById('total-pages-num');

  // Modal Elements
  const modal = document.getElementById('modal-booking-details');
  const modalCloseBtn = document.getElementById('btn-close-modal');
  const modalCloseFooter = document.getElementById('btn-modal-close-footer');
  const modalRefTitle = document.getElementById('modal-ref-title');
  const modalCreatedTime = document.getElementById('modal-created-time');
  const modalCustomerName = document.getElementById('modal-customer-name');
  const modalCustomerPhone = document.getElementById('modal-customer-phone');
  const modalLinkCall = document.getElementById('modal-link-call');
  const modalLinkWhatsApp = document.getElementById('modal-link-whatsapp');
  const modalCustomerEmail = document.getElementById('modal-customer-email');
  const modalService = document.getElementById('modal-service');
  const modalDate = document.getElementById('modal-date');
  const modalTime = document.getElementById('modal-time');
  const modalMessageText = document.getElementById('modal-message-text');
  const modalWhatsAppStatus = document.getElementById('modal-whatsapp-status');
  const modalUpdatedTime = document.getElementById('modal-updated-time');
  const modalSelectStatus = document.getElementById('modal-select-status');
  const btnModalSaveStatus = document.getElementById('btn-modal-save-status');
  const modalBtnChatWhatsApp = document.getElementById('modal-btn-chat-whatsapp');

  // Toast
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');

  // App State
  let currentUser = null;
  let authToken = localStorage.getItem('admin_token') || null;
  let currentPage = 1;
  const pageSize = 15;
  let activeBookings = [];
  let currentModalBooking = null;
  let searchDebounceTimer = null;

  // ============================================================================
  // TOAST NOTIFICATIONS
  // ============================================================================
  function showToast(message, isError = false) {
    if (!toast) return;
    toastMsg.textContent = message;
    if (isError) {
      toastIcon.className = 'fa-solid fa-triangle-exclamation';
      toastIcon.style.color = '#ef4444';
    } else {
      toastIcon.className = 'fa-solid fa-circle-check';
      toastIcon.style.color = '#22c55e';
    }
    toast.style.display = 'flex';
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.style.display = 'none';
    }, 4000);
  }

  // ============================================================================
  // API CLIENT HELPERS
  // ============================================================================
  async function apiFetch(endpoint, options = {}) {
    const headers = options.headers || {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    headers['Content-Type'] = 'application/json';

    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    if (response.status === 401) {
      // Session expired or unauthenticated
      handleLogoutLocal();
      throw new Error('Unauthorized');
    }

    return response;
  }

  // ============================================================================
  // AUTHENTICATION FLOW
  // ============================================================================
  async function checkAuth() {
    try {
      const res = await apiFetch('/api/auth/me');
      const data = await res.json();
      if (data && data.authenticated && data.user) {
        currentUser = data.user;
        renderDashboardView();
        return;
      }
    } catch {
      // not authenticated
    }
    renderLoginView();
  }

  function renderLoginView() {
    appLoading.style.display = 'none';
    viewDashboard.style.display = 'none';
    viewLogin.style.display = 'flex';
  }

  function renderDashboardView() {
    appLoading.style.display = 'none';
    viewLogin.style.display = 'none';
    viewDashboard.style.display = 'block';

    if (currentUser) {
      userDisplayName.textContent = currentUser.name || currentUser.username;
      userDisplayEmail.textContent = currentUser.username;
    }

    loadDashboardStats();
    loadBookings();
  }

  function handleLogoutLocal() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('admin_token');
    renderLoginView();
  }

  // Toggle password visibility
  if (btnTogglePassword && passwordInput) {
    btnTogglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      btnTogglePassword.innerHTML = isPassword
        ? '<i class="fa-regular fa-eye-slash"></i>'
        : '<i class="fa-regular fa-eye"></i>';
    });
  }

  // Handle Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginAlert.style.display = 'none';

      const username = usernameInput.value.trim();
      const password = passwordInput.value;

      if (!username || !password) {
        loginErrorMsg.textContent = 'Please enter both username and password.';
        loginAlert.style.display = 'flex';
        return;
      }

      // Button loading state
      btnLoginSubmit.disabled = true;
      const btnText = btnLoginSubmit.querySelector('.btn-text');
      const btnLoading = btnLoginSubmit.querySelector('.btn-loading');
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline-flex';

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data || !data.success) {
          loginErrorMsg.textContent = data?.error || 'Invalid credentials. Please try again.';
          loginAlert.style.display = 'flex';
          btnLoginSubmit.disabled = false;
          if (btnText) btnText.style.display = 'inline-flex';
          if (btnLoading) btnLoading.style.display = 'none';
          return;
        }

        // Login successful
        authToken = data.token;
        if (authToken) {
          localStorage.setItem('admin_token', authToken);
        }
        currentUser = data.user;
        showToast(`Welcome back, ${currentUser.name || currentUser.username}!`);
        renderDashboardView();

      } catch (err) {
        loginErrorMsg.textContent = 'Network or server error during authentication.';
        loginAlert.style.display = 'flex';
      } finally {
        btnLoginSubmit.disabled = false;
        if (btnText) btnText.style.display = 'inline-flex';
        if (btnLoading) btnLoading.style.display = 'none';
      }
    });
  }

  // Handle Logout Button
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      try {
        await apiFetch('/api/auth/logout', { method: 'POST' });
      } catch {
        // ignore
      }
      handleLogoutLocal();
      showToast('Logged out successfully.');
    });
  }

  // ============================================================================
  // DASHBOARD STATS
  // ============================================================================
  async function loadDashboardStats() {
    try {
      const res = await apiFetch('/api/admin/stats');
      const data = await res.json();
      if (data && data.success && data.stats) {
        const s = data.stats;
        statTotal.textContent = s.total;
        statNew.textContent = s.new;
        statContacted.textContent = s.contacted;
        statConfirmed.textContent = s.confirmed;
        statCompleted.textContent = s.completed;
        statCancelled.textContent = s.cancelled;
      }
    } catch (err) {
      console.warn('Could not load stats:', err);
    }
  }

  // Clicking a stat card sets the filter immediately
  statCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetStatus = card.getAttribute('data-status');
      statCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      filterStatus.value = targetStatus;
      currentPage = 1;
      loadBookings();
    });
  });

  // ============================================================================
  // BOOKINGS LIST & FILTERS
  // ============================================================================
  function updateActiveFilterTags() {
    const statusVal = filterStatus.value;
    const serviceVal = filterService.value;
    const dateVal = filterDate.value;
    const searchVal = filterSearch.value.trim();

    const tags = [];
    if (statusVal && statusVal !== 'all') {
      tags.push({ label: `Status: ${statusVal}`, type: 'status' });
    }
    if (serviceVal && serviceVal !== 'all') {
      tags.push({ label: `Service: ${serviceVal}`, type: 'service' });
    }
    if (dateVal) {
      tags.push({ label: `Date: ${dateVal}`, type: 'date' });
    }
    if (searchVal) {
      tags.push({ label: `Search: "${searchVal}"`, type: 'search' });
    }

    if (tags.length > 0) {
      activeFiltersBar.style.display = 'flex';
      filterTags.innerHTML = tags.map(t => `
        <span class="filter-tag">
          ${escapeHtml(t.label)}
          <span class="filter-tag-remove" data-type="${t.type}">&times;</span>
        </span>
      `).join('');

      // Add remove handler
      filterTags.querySelectorAll('.filter-tag-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const type = e.target.getAttribute('data-type');
          if (type === 'status') {
            filterStatus.value = 'all';
            statCards.forEach(c => c.classList.remove('active'));
          } else if (type === 'service') {
            filterService.value = 'all';
          } else if (type === 'date') {
            filterDate.value = '';
          } else if (type === 'search') {
            filterSearch.value = '';
            btnClearSearch.style.display = 'none';
          }
          currentPage = 1;
          loadBookings();
        });
      });
    } else {
      activeFiltersBar.style.display = 'none';
      filterTags.innerHTML = '';
    }
  }

  async function loadBookings() {
    // Show loading state
    tableBody.innerHTML = '';
    tableEmpty.style.display = 'none';
    tableError.style.display = 'none';
    tableLoading.style.display = 'flex';

    updateActiveFilterTags();

    const searchParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: pageSize.toString()
    });

    const status = filterStatus.value;
    if (status && status !== 'all') searchParams.set('status', status);

    const service = filterService.value;
    if (service && service !== 'all') searchParams.set('service', service);

    const date = filterDate.value;
    if (date) searchParams.set('date', date);

    const search = filterSearch.value.trim();
    if (search) searchParams.set('search', search);

    try {
      const res = await apiFetch(`/api/admin/bookings?${searchParams.toString()}`);
      const data = await res.json();

      tableLoading.style.display = 'none';

      if (!res.ok || !data || !data.success) {
        tableError.style.display = 'flex';
        return;
      }

      activeBookings = data.bookings || [];
      const pagination = data.pagination || { total: 0, page: 1, limit: pageSize, totalPages: 1 };

      if (activeBookings.length === 0) {
        tableEmpty.style.display = 'flex';
        renderPagination(pagination);
        return;
      }

      renderTableRows(activeBookings);
      renderPagination(pagination);

    } catch (err) {
      if (err.message !== 'Unauthorized') {
        tableLoading.style.display = 'none';
        tableError.style.display = 'flex';
      }
    }
  }

  function renderTableRows(bookings) {
    tableBody.innerHTML = bookings.map(b => {
      const submittedFormatted = formatDate(b.created_at);
      const scheduleFormatted = formatSchedule(b.booking_date, b.booking_time);
      const waHandoff = b.whatsapp_opened_at
        ? `<span class="badge-wa-opened" title="WhatsApp opened at ${formatDate(b.whatsapp_opened_at)}"><i class="fa-solid fa-circle-check"></i> Opened (${formatDateShort(b.whatsapp_opened_at)})</span>`
        : `<span class="badge-wa-none"><i class="fa-regular fa-clock"></i> Not recorded</span>`;

      return `
        <tr data-id="${escapeHtml(b.id)}">
          <td>
            <button class="booking-ref-btn btn-copy-ref" data-ref="${escapeHtml(b.booking_reference)}" title="Click to copy reference">
              ${escapeHtml(b.booking_reference)} <i class="fa-regular fa-copy"></i>
            </button>
          </td>
          <td>
            <div class="table-customer-wrap">
              <span class="table-customer-name">${escapeHtml(b.customer_name)}</span>
              <a href="tel:${escapeHtml(b.customer_phone)}" class="table-customer-phone"><i class="fa-solid fa-phone"></i> ${escapeHtml(b.customer_phone)}</a>
            </div>
          </td>
          <td>
            <strong>${escapeHtml(b.service)}</strong>
          </td>
          <td>
            <span>${escapeHtml(scheduleFormatted)}</span>
          </td>
          <td>
            <span title="${escapeHtml(b.created_at)}">${escapeHtml(submittedFormatted)}</span>
          </td>
          <td>
            <span class="badge-source"><i class="fa-solid fa-globe"></i> Website</span>
          </td>
          <td>
            <select class="table-status-select" data-id="${escapeHtml(b.id)}">
              <option value="new" ${b.status === 'new' ? 'selected' : ''}>New</option>
              <option value="contacted" ${b.status === 'contacted' ? 'selected' : ''}>Contacted</option>
              <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Completed</option>
              <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            ${waHandoff}
          </td>
          <td class="text-right">
            <div class="table-actions">
              <button class="btn-action-view btn-view-details" data-id="${escapeHtml(b.id)}">
                <i class="fa-solid fa-eye"></i> Details
              </button>
              <a href="${getWhatsAppChatLink(b)}" target="_blank" rel="noopener noreferrer" class="btn-action-wa" title="Open WhatsApp Chat with Customer">
                <i class="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach Event Listeners to rows
    tableBody.querySelectorAll('.btn-copy-ref').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ref = e.currentTarget.getAttribute('data-ref');
        navigator.clipboard.writeText(ref).then(() => {
          showToast(`Reference ${ref} copied to clipboard!`);
        });
      });
    });

    tableBody.querySelectorAll('.table-status-select').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const bookingId = e.currentTarget.getAttribute('data-id');
        const newStatus = e.currentTarget.value;
        await updateBookingStatus(bookingId, newStatus);
      });
    });

    tableBody.querySelectorAll('.btn-view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const bookingId = e.currentTarget.getAttribute('data-id');
        const found = activeBookings.find(b => b.id === bookingId);
        if (found) {
          openBookingModal(found);
        }
      });
    });
  }

  function renderPagination(pagination) {
    const total = pagination.total || 0;
    const page = pagination.page || 1;
    const limit = pagination.limit || pageSize;
    const totalPages = pagination.totalPages || 1;

    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(total, page * limit);

    pageStartCount.textContent = start;
    pageEndCount.textContent = end;
    totalBookingsCount.textContent = total;

    currentPageNum.textContent = page;
    totalPagesNum.textContent = totalPages;

    btnPrevPage.disabled = page <= 1;
    btnNextPage.disabled = page >= totalPages;
  }

  // Prev / Next Page buttons
  btnPrevPage.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadBookings();
    }
  });

  btnNextPage.addEventListener('click', () => {
    currentPage++;
    loadBookings();
  });

  // Filter input listeners
  filterStatus.addEventListener('change', () => {
    currentPage = 1;
    statCards.forEach(c => {
      if (c.getAttribute('data-status') === filterStatus.value) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
    loadBookings();
  });

  filterService.addEventListener('change', () => {
    currentPage = 1;
    loadBookings();
  });

  filterDate.addEventListener('change', () => {
    currentPage = 1;
    loadBookings();
  });

  filterSearch.addEventListener('input', () => {
    const val = filterSearch.value.trim();
    btnClearSearch.style.display = val ? 'block' : 'none';

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      currentPage = 1;
      loadBookings();
    }, 300);
  });

  btnClearSearch.addEventListener('click', () => {
    filterSearch.value = '';
    btnClearSearch.style.display = 'none';
    currentPage = 1;
    loadBookings();
  });

  btnResetFilters.addEventListener('click', () => {
    filterSearch.value = '';
    btnClearSearch.style.display = 'none';
    filterStatus.value = 'all';
    filterService.value = 'all';
    filterDate.value = '';
    statCards.forEach(c => c.classList.remove('active'));
    currentPage = 1;
    loadBookings();
  });

  btnRefresh.addEventListener('click', () => {
    loadDashboardStats();
    loadBookings();
    showToast('Bookings refreshed.');
  });

  btnRetryTable.addEventListener('click', () => {
    loadBookings();
  });

  // ============================================================================
  // STATUS UPDATE
  // ============================================================================
  async function updateBookingStatus(bookingId, newStatus) {
    try {
      const res = await apiFetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok || !data || !data.success) {
        showToast(data?.error || 'Failed to update status', true);
        loadBookings();
        return;
      }

      showToast(`Status updated to "${newStatus}".`);
      loadDashboardStats();

      // Update in active array
      const idx = activeBookings.findIndex(b => b.id === bookingId);
      if (idx !== -1) {
        activeBookings[idx].status = newStatus;
      }
    } catch (err) {
      showToast('Error updating status.', true);
      loadBookings();
    }
  }

  // ============================================================================
  // BOOKING DETAILS MODAL
  // ============================================================================
  function openBookingModal(booking) {
    currentModalBooking = booking;

    modalRefTitle.textContent = booking.booking_reference;
    modalCreatedTime.textContent = `Submitted via Website on ${formatDate(booking.created_at)}`;
    modalCustomerName.textContent = booking.customer_name;
    modalCustomerPhone.textContent = booking.customer_phone;
    modalLinkCall.href = `tel:${booking.customer_phone}`;
    modalLinkWhatsApp.href = getWhatsAppChatLink(booking);

    modalCustomerEmail.textContent = booking.customer_email || 'Not provided';
    modalService.textContent = booking.service;
    modalDate.textContent = booking.booking_date || 'Flexible / Not specified';
    modalTime.textContent = booking.booking_time || 'Flexible / Not specified';

    modalMessageText.textContent = booking.message || 'No additional notes provided by customer.';

    modalWhatsAppStatus.innerHTML = booking.whatsapp_opened_at
      ? `<span style="color:#15803d; font-weight:600;"><i class="fa-solid fa-check"></i> WhatsApp Opened at ${formatDate(booking.whatsapp_opened_at)}</span>`
      : `<span style="color:#64748b;">Handoff attempt not recorded</span>`;

    modalUpdatedTime.textContent = formatDate(booking.updated_at || booking.created_at);
    modalSelectStatus.value = booking.status;
    modalBtnChatWhatsApp.href = getWhatsAppChatLink(booking);

    modal.style.display = 'flex';
  }

  function closeModal() {
    modal.style.display = 'none';
    currentModalBooking = null;
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalCloseFooter.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });

  btnModalSaveStatus.addEventListener('click', async () => {
    if (!currentModalBooking) return;
    const newStatus = modalSelectStatus.value;
    btnModalSaveStatus.disabled = true;
    await updateBookingStatus(currentModalBooking.id, newStatus);
    btnModalSaveStatus.disabled = false;
    currentModalBooking.status = newStatus;
    loadBookings();
  });

  // ============================================================================
  // UTILITY HELPERS
  // ============================================================================
  function getWhatsAppChatLink(booking) {
    const rawPhone = booking.customer_phone || '';
    const digits = rawPhone.replace(/\D/g, '');
    let formattedPhone = digits;
    if (digits.startsWith('0') && digits.length === 10) {
      formattedPhone = '233' + digits.substring(1);
    } else if (digits.length === 9) {
      formattedPhone = '233' + digits;
    }

    const text = `Hello ${booking.customer_name},\n\nThis is Kleenit Ghana Limited following up on your booking request (*${booking.booking_reference}*) for *${booking.service}* submitted through our website.\n\nHow can we best assist you today?`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
  }

  function formatDate(isoString) {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  }

  function formatDateShort(isoString) {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }

  function formatSchedule(date, time) {
    if (!date && !time) return 'Flexible';
    if (date && time) return `${date} (${time})`;
    return date || time;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Initialize Auth Check
  checkAuth();
});
