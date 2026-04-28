import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft, Upload, Globe, Briefcase, GraduationCap, User } from 'lucide-react';

const Registration = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = 4;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-step">
            <div className="form-group-header">
              <User size={24} className="text-primary" />
              <h2>Personal Information</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-step">
            <div className="form-group-header">
              <GraduationCap size={24} className="text-primary" />
              <h2>Academic Details</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Graduation Year</label>
                <select>
                  <option>Select Year</option>
                  {[...Array(30)].map((_, i) => (
                    <option key={i}>{2026 - i}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Course / Department</label>
                <input type="text" placeholder="Computer Science" />
              </div>
              <div className="form-group">
                <label>Higher Studies (Optional)</label>
                <input type="text" placeholder="MBA, PhD, etc." />
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-step">
            <div className="form-group-header">
              <Briefcase size={24} className="text-primary" />
              <h2>Professional Profile</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Current Company</label>
                <input type="text" placeholder="Google, Microsoft, etc." />
              </div>
              <div className="form-group">
                <label>Job Role</label>
                <input type="text" placeholder="Software Engineer" />
              </div>
              <div className="form-group">
                <label>City / Country</label>
                <input type="text" placeholder="New York, USA" />
              </div>
              <div className="form-group">
                <label>LinkedIn URL</label>
                <div className="input-with-icon">
                  <Globe size={18} />
                  <input type="url" placeholder="linkedin.com/in/username" />
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-step">
            <div className="form-group-header">
              <CheckCircle2 size={24} className="text-primary" />
              <h2>Final Details</h2>
            </div>
            <div className="form-group">
              <label>Achievements / Bio</label>
              <textarea placeholder="Tell us about your journey..." rows={4}></textarea>
            </div>
            <div className="form-group">
              <label>Profile Photo</label>
              <div className="file-upload">
                <Upload size={24} />
                <p>Click or drag to upload your photo</p>
                <span>PNG, JPG up to 5MB</span>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="registration-page section-padding">
      <div className="container">
        <div className="registration-container card">
          {!submitted ? (
            <>
              <div className="registration-header">
                <h1>Join the Legacy</h1>
                <p>Complete the steps below to join our exclusive alumni network.</p>
                
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
                  </div>
                  <div className="steps-indicator">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`}>
                        {step > s ? <CheckCircle2 size={16} /> : s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="registration-form">
                {renderStep()}

                <div className="form-footer">
                  <div className="form-actions-left">
                    {step > 1 && (
                      <button type="button" className="btn btn-outline" onClick={prevStep}>
                        <ChevronLeft size={20} />
                        Back
                      </button>
                    )}
                  </div>
                  <div className="form-actions-right">
                    <button type="button" className="btn btn-outline" style={{ border: 'none' }}>Save Draft</button>
                    {step < totalSteps ? (
                      <button type="button" className="btn btn-primary" onClick={nextStep}>
                        Continue
                        <ChevronRight size={20} />
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-primary">
                        Submit Application
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </>
          ) : (
            <motion.div 
              className="success-popup"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="success-icon">
                <CheckCircle2 size={80} />
              </div>
              <h2>Application Submitted!</h2>
              <p>Thank you for joining AlumniConnect. Our team will review your application and get back to you shortly.</p>
              <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
                Back to Home
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;
