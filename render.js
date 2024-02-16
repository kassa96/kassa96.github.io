export function renderConnexion(){
return ` <div class="row">
<div class="col-md-12 connexion ">
    <div class="login-form">
        <h2 class="text-center mb-4">Login</h2>
        <form>
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" class="form-control" autocomplete="current-password" placeholder="Enter your username">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" autocomplete="current-password" id="password" class="form-control" placeholder="Enter your password">
            </div>
            <button type="submit" id="submit-btn"class="btn btn-primary btn-block">Login</button>
        </form>
        <div id="erreur-connexion" style = "display: none;" class="mt-3 text-danger">Invalid username or password. Please try again.</div>
    </div>
</div>
</div>`
}

export function renderProfil(){
    return `<div class="img" style="background-image: linear-gradient(150deg, rgba(63, 174, 255, .3) 15%, rgba(63, 174, 255, .3) 70%, rgba(63, 174, 255, .3) 94%), url(./O1.jpeg); height: 350px;"></div>

    <div class="card social-prof">
        <div class="card-body">
            <div class="wrapper">
                <img src="default.png" alt="" class="user-profile">
                <h3 id="user-name"></h3>
                <div><p id="login"></p></div>
                <div><p id="mail"></p></div>
                <div><p id="campus"></p></div>
                <div>    <button type="button" id="logout" class="btn btn-danger">Log out</button>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row justify-content-md-center">
        <div class="col-lg-6">
            <div class="card">
                <div class="card-body info-card social-about">
                    <div class="row">
                        <div class="col-6">
                            <h2 class="text-blue">XP amount</h2>
                            <h1 id="xp"></h1>
                        </div>
                        <div class="col-6">
                            <h2 class="text-blue">Ratio</h2>
                            <h1 id="ration"></h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="offset-1 col-lg-10">
        <div class="card">
            <div class="card-body info-card social-about">
                <h2 class="text-blue">10 Best Skills</h2>
                <div class="row">
                    <div class="col-12">
                        <div id="skills_section"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row">
        <div class="offset-1 col-lg-10">
            <div class="card info-card">
                <div class="card-body">
                    <h2 class="text-blue">Projects PASS and FAIL ratio</h2>
                    <div class="row">
                        <div id="piechart" style="width: 600px; height: 500px;"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="offset-1 col-lg-10">
            <div class="card info-card">
                <div class="card-body">
                    <h2 class="text-blue">XP amount per projet</h2>
                    <div class="row">
                        <div id="columnchart_material" style="width: 600px; height: 500px;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}