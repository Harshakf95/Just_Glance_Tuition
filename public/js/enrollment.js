document.addEventListener('DOMContentLoaded', function() {
    // Get all enrollment buttons
    const enrollButtons = document.querySelectorAll('.enroll-btn');
    const enrollmentForm = document.getElementById('enrollmentForm');
    const submitButton = document.getElementById('submitEnrollment');

    // Add click event listeners to all enroll buttons
    enrollButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get course details from data attributes
            const courseName = this.dataset.course;
            const courseFee = this.dataset.fee;
            const courseDuration = this.dataset.duration;
            const courseSchedule = this.dataset.schedule;

            // Update modal with course details
            document.getElementById('selectedCourse').textContent = courseName;
            document.getElementById('courseFee').textContent = courseFee;
            document.getElementById('courseDuration').textContent = courseDuration;
            document.getElementById('courseSchedule').textContent = courseSchedule;
        });
    });

    // Form validation and submission
    submitButton.addEventListener('click', async function(event) {
        if (!enrollmentForm.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            enrollmentForm.classList.add('was-validated');
            return;
        }

        // Gather form data
        const formData = {
            courseName: document.getElementById('selectedCourse').textContent,
            studentName: document.getElementById('studentName').value,
            studentEmail: document.getElementById('studentEmail').value,
            studentPhone: document.getElementById('studentPhone').value,
            studentDOB: document.getElementById('studentDOB').value,
            studentAddress: document.getElementById('studentAddress').value,
            previousSchool: document.getElementById('previousSchool').value,
            previousGrade: document.getElementById('previousGrade').value,
            courseFee: document.getElementById('courseFee').textContent,
            courseDuration: document.getElementById('courseDuration').textContent,
            courseSchedule: document.getElementById('courseSchedule').textContent
        };

        // Disable button to prevent duplicate submits
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            // Fetch CSRF token first
            const csrfResp = await fetch('/api/csrf-token', { credentials: 'include' });
            if (!csrfResp.ok) throw new Error('Unable to initialize submission');
            const { csrfToken } = await csrfResp.json();

            // Send enrollment data to server with CSRF token
            const response = await fetch('/api/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok || !data.success) {
                const msg = data && (data.message || data.error) || `Enrollment failed (${response.status})`;
                throw new Error(msg);
            }

            // Show success message
            await Swal.fire({
                title: 'Enrollment Successful!',
                text: 'Thank you for enrolling. We will contact you shortly.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            // Reset form and close modal
            enrollmentForm.reset();
            enrollmentForm.classList.remove('was-validated');
            bootstrap.Modal.getInstance(document.getElementById('enrollmentModal')).hide();
        } catch (error) {
            // Show error message
            Swal.fire({
                title: 'Enrollment Failed',
                text: error.message || 'Please try again later',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });

    // Reset form when modal is closed
    document.getElementById('enrollmentModal').addEventListener('hidden.bs.modal', function () {
        enrollmentForm.reset();
        enrollmentForm.classList.remove('was-validated');
    });
});
