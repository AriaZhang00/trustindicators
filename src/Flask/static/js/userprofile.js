function openModal() {
  document.getElementById('profilePhotoModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('profilePhotoModal').style.display = 'none';
}

window.onclick = function(event) {
  if (event.target === document.getElementById('profilePhotoModal')) {
    closeModal();
  }
}

document.addEventListener('DOMContentLoaded', function() {
    var selectableImages = document.querySelectorAll('.selectable-image');
    function clearSelection() {
        selectableImages.forEach(function(img) {
            img.classList.remove('selected');
        });
    }
    selectableImages.forEach(function(image) {
        image.addEventListener('click', function() {
            clearSelection(); // Clear any previous selections
            image.classList.add('selected');
        });
    });
    var exitButton = document.querySelector('.modal-options button:nth-child(2)');
    if(exitButton) {
        exitButton.addEventListener('click', function() {
            clearSelection();
            closeModal();
        });
    }
});

function saveSelection() {
    var selectedImageElement = document.querySelector('.selectable-image.selected');
    var imageSrc = selectedImageElement ? selectedImageElement.getAttribute('src') : '';
    var match = imageSrc.match(/(\d+)\.jpg$/);
    var selectedImageId = match ? match[1] : null;

    if (selectedImageElement){
        selectedImageElement.classList.remove('selected');
    }

    if (selectedImageId) {
        fetch('/change_profile_photo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: 'selected_image=' + encodeURIComponent(selectedImageId)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('user-profile-picture').src = imageSrc;

                showSuccessAlert(data.message);
                closeModal();
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            showErrorAlert(error.message);
        });
    } else {
        showErrorAlert('Please select an image before saving.');
    }
}

function showSuccessAlert(message) {
    var alertBox = createAlert(message);
    alertBox.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
    alertBox.classList.add('success-alert');
    document.body.prepend(alertBox);

    setTimeout(function() {
        fadeOutAlert(alertBox);
    }, 3000);
}

function showErrorAlert(message) {
    var alertBox = createAlert(message);
    alertBox.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
    alertBox.classList.add('error-alert');
    document.body.prepend(alertBox);

    setTimeout(function() {
        fadeOutAlert(alertBox);
    }, 5000);
}

function createAlert(message) {
    var alertBox = document.createElement('div');
    alertBox.textContent = message;
    alertBox.style.color = 'white';
    alertBox.style.padding = '15px';
    alertBox.style.margin = '15px';
    alertBox.style.borderRadius = '4px';
    alertBox.style.position = 'fixed';
    alertBox.style.left = '50%';
    alertBox.style.top = '20px';
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
    alertBox.style.transition = 'opacity 0.5s ease, top 0.5s ease';
    alertBox.style.zIndex = '1000';
    return alertBox;
}

function fadeOutAlert(alertBox) {
    alertBox.style.opacity = '0';
    alertBox.style.top = '10px';

    setTimeout(function() {
        alertBox.remove();
    }, 500);
}
