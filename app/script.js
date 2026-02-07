 // Show page function
        function showPage(pageId) {
            // Hide all pages
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => {
                page.style.display = 'none';
            });
            
            // Show the selected page
            document.getElementById(pageId).style.display = 'block';
            
            // Update active nav link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${pageId}`) {
                    link.classList.add('active');
                }
            });
            
            // Scroll to top when changing pages
            window.scrollTo(0, 0);
        }
        
        // Initialize file upload functionality
        document.addEventListener('DOMContentLoaded', function() {
            const uploadArea = document.getElementById('uploadArea');
            const fileInput = document.getElementById('fingerprintUpload');
            const preview = document.getElementById('fingerprintPreview');
            const previewImage = document.getElementById('previewImage');
            const analyzeButton = document.getElementById('analyzeButtonContainer');
            
            // Handle file selection via click
            fileInput.addEventListener('change', function(e) {
                handleFileSelect(e.target.files[0]);
            });
            
            // Handle drag and drop
            uploadArea.addEventListener('dragover', function(e) {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
            
            uploadArea.addEventListener('dragleave', function(e) {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
            });
            
            uploadArea.addEventListener('drop', function(e) {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                if (e.dataTransfer.files.length) {
                    handleFileSelect(e.dataTransfer.files[0]);
                }
            });
            
            // Handle click on upload area
            uploadArea.addEventListener('click', function() {
                fileInput.click();
            });
            
            function handleFileSelect(file) {
                if (!file.type.match('image.*')) {
                    alert('Please select an image file.');
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB.');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    preview.style.display = 'block';
                    analyzeButton.style.display = 'block';
                    uploadArea.style.display = 'none';
                    
                    // Show success message
                    alert('Fingerprint image uploaded successfully! Click "Analyze Fingerprint" to proceed.');
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Function to use sample fingerprint
        function useSample(bloodGroup) {
            const sampleImages = {
                'A+': 'https://images.unsplash.com/photo-1553830591-d8632a99e6ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                'B+': 'https://images.unsplash.com/photo-1553830591-2f39e38a013c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                'O+': 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                'AB+': 'https://images.unsplash.com/photo-1583484963886-cfe2bff2945f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            };
            
            const preview = document.getElementById('fingerprintPreview');
            const previewImage = document.getElementById('previewImage');
            const analyzeButton = document.getElementById('analyzeButtonContainer');
            const uploadArea = document.getElementById('uploadArea');
            
            previewImage.src = sampleImages[bloodGroup];
            preview.style.display = 'block';
            analyzeButton.style.display = 'block';
            uploadArea.style.display = 'none';
            
            // Simulate analysis with the selected blood group
            setTimeout(() => analyzeFingerprint(bloodGroup), 100);
        }
        
        // Function to analyze fingerprint
        function analyzeFingerprint(presetBloodGroup = null) {
            const resultsContainer = document.getElementById('resultsContainer');
            const bloodGroupResult = document.getElementById('bloodGroupResult');
            const bloodGroupType = document.getElementById('bloodGroupType');
            const bloodGroupDescription = document.getElementById('bloodGroupDescription');
            const canDonateTo = document.getElementById('canDonateTo');
            const canReceiveFrom = document.getElementById('canReceiveFrom');
            
            // Blood group data
            const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
            const bloodGroupInfo = {
                'A+': {
                    description: 'Blood group A+ is the second most common blood type. If your blood is A+, you can give blood to people with A+ and AB+ blood types, and receive blood from A+, A-, O+ and O- donors.',
                    donateTo: 'A+, AB+',
                    receiveFrom: 'A+, A-, O+, O-'
                },
                'A-': {
                    description: 'Blood group A- is a rare blood type. If your blood is A-, you can give blood to people with A+, A-, AB+ and AB- blood types, and receive blood from A- and O- donors.',
                    donateTo: 'A+, A-, AB+, AB-',
                    receiveFrom: 'A-, O-'
                },
                'B+': {
                    description: 'Blood group B+ is a relatively rare blood type. If your blood is B+, you can give blood to people with B+ and AB+ blood types, and receive blood from B+, B-, O+ and O- donors.',
                    donateTo: 'B+, AB+',
                    receiveFrom: 'B+, B-, O+, O-'
                },
                'B-': {
                    description: 'Blood group B- is a very rare blood type. If your blood is B-, you can give blood to people with B+, B-, AB+ and AB- blood types, and receive blood from B- and O- donors.',
                    donateTo: 'B+, B-, AB+, AB-',
                    receiveFrom: 'B-, O-'
                },
                'O+': {
                    description: 'Blood group O+ is the most common blood type. If your blood is O+, you can give blood to people with O+, A+, B+ and AB+ blood types, and receive blood from O+ and O- donors.',
                    donateTo: 'O+, A+, B+, AB+',
                    receiveFrom: 'O+, O-'
                },
                'O-': {
                    description: 'Blood group O- is the universal donor blood type. If your blood is O-, you can give blood to anyone, but can only receive blood from O- donors.',
                    donateTo: 'All blood types',
                    receiveFrom: 'O-'
                },
                'AB+': {
                    description: 'Blood group AB+ is the universal recipient blood type. If your blood is AB+, you can receive blood from anyone, but can only give blood to people with AB+ blood type.',
                    donateTo: 'AB+',
                    receiveFrom: 'All blood types'
                },
                'AB-': {
                    description: 'Blood group AB- is a very rare blood type. If your blood is AB-, you can give blood to people with AB+ and AB- blood types, and receive blood from A-, B-, AB- and O- donors.',
                    donateTo: 'AB+, AB-',
                    receiveFrom: 'A-, B-, AB-, O-'
                }
            };
            
            // Determine blood group (random or preset)
            let bloodGroup;
            if (presetBloodGroup) {
                bloodGroup = presetBloodGroup;
            } else {
                // Random selection for demo (in real app, this would be AI analysis)
                const randomIndex = Math.floor(Math.random() * bloodGroups.length);
                bloodGroup = bloodGroups[randomIndex];
            }
            
            // Show loading animation
            bloodGroupResult.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            resultsContainer.style.display = 'block';
            
            // Scroll to results
            setTimeout(() => {
                resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            
            // Simulate analysis delay
            setTimeout(() => {
                // Update results
                bloodGroupResult.textContent = bloodGroup;
                bloodGroupType.textContent = bloodGroup;
                bloodGroupDescription.textContent = bloodGroupInfo[bloodGroup].description;
                canDonateTo.textContent = bloodGroupInfo[bloodGroup].donateTo;
                canReceiveFrom.textContent = bloodGroupInfo[bloodGroup].receiveFrom;
                
                // Show success message
                alert(`Analysis complete! Your blood group is ${bloodGroup}.`);
            }, 2000);
        }
        
        // Handle form submissions
      document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(data.message);

    if (data.status === "success") {
        showPage('getstarted');
    }
});

        
       document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const res = await fetch("/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ firstName, lastName, email, password })
    });

    const data = await res.json();
    alert(data.message);

    if (data.status === "success") {
        showPage('signin');
    }
});
    async function predictBloodGroup() {
    const fileInput = document.getElementById("fingerprint");
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const res = await fetch("/predict", {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    document.getElementById("result").innerText =
        `Blood Group: ${data.blood_group} (${data.confidence}%)`;
        document.getElementById("tryAgainBtn").style.display = "inline-block";
}

        
        // Initialize the page
        showPage('home');