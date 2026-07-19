import { useAuth } from "../contexts/AuthContext";

function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className="profile-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="profile-card">
              <div className="profile-avatar">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.fullName}
                  />
                ) : (
                  currentUser.fullName
                    ?.charAt(0)
                    .toUpperCase()
                )}
              </div>

              <div className="profile-information">
                <h2>{currentUser.fullName}</h2>

                <p className="text-secondary">
                  {currentUser.email}
                </p>

                <span className="profile-role">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;