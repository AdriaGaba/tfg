pragma solidity ^0.4.0;

contract departmentManagement{


    struct Department {
        string d; //Nom del departament
        string des; //Descripció del departament
        string ofi; // Oficina del departament
        int projNum; //Nombre de projectes en el dpt
        bool isValue; //true = departament ja existeix
    }
    struct Programmer {
        string pg; //Nom el programador
        string d; //Department al que pertany
        bool isValue; //true = existeix programador en aquest dpt
    }
    address creator;
    mapping(bytes32 => Department) RepositoryDepartment;
    mapping(bytes32 => Programmer) RepositoryProgrammer;

    modifier onlyBy(address _account){
        require(msg.sender == _account);
        _;
    }

    event Create_dpt (string NomDPT, string DescripcioDPT, string OficinaDPT, address requestor);
    event Assign_dpt (string NomDPT, string Programador, address requestor);
    event Close_dpt (string NomDPT, address requestor);

    projectManagement projectContract;
    function setAddressProjectContract (address addr) public {
        projectContract = projectManagement(addr);
    }

    // ----------------------------- CREATE DEPARTMENT -----------------------------

    function create(string _d, string _des, string _ofi) public{
        bytes32 hash = keccak256(_d);
        if(RepositoryDepartment[hash].isValue){ //Comprovar si el dpt existeix
            //Si el dpt "_d" ja existeix, cancel·lar transacció
            revert();
        }
        RepositoryDepartment[hash] = Department(_d,_des,_ofi,0,true);
        emit Create_dpt(_d,_des,_ofi,msg.sender);
    }
    // ----------------------------- ASSIGN DEPARTMENT -----------------------------
    function assign(string _d, string _pg) public{
        bytes32 hash = keccak256(_pg);
        bytes32 hash1 = keccak256(_d);
        if (RepositoryProgrammer[hash].isValue || !RepositoryDepartment[hash1].isValue){
            //Si el programador ja pertany a un departament o
            //el departament no existeix
            revert();
        }
        RepositoryProgrammer[hash].isValue = true;
        RepositoryProgrammer[hash].d = _d;

        emit Assign_dpt(_d,_pg,msg.sender);
    }
    // ----------------------------- CLOSE DEPARTMENT -----------------------------
    function close(string _d) public{
        bytes32 hash = keccak256(_d);
        if (!RepositoryDepartment[hash].isValue || RepositoryDepartment[hash].projNum != 0){
            //Si el departamanent "_d" no existeix o
            //hi han projectes actius a "_d"
            revert();
        }
        RepositoryDepartment[hash].isValue = false;
        emit Close_dpt(_d, msg.sender);
    }
    // ------------------------------ DERIVED PERDICATES -----------------------------

    function exists(string _d) external view returns (bool){
        bytes32 hash = keccak256(_d);
        if (RepositoryDepartment[hash].isValue){
            //Si el departament existeix
            return true;
        }
        return false;
    }

    function belongsDPT(string pg, string d) external view returns (bool){
        bytes32 hash = keccak256(pg);
        Programmer memory pg_instance = RepositoryProgrammer[hash];
        if (keccak256(pg_instance.d) == keccak256(d)){
            //True si el programador pg pertany a d
            return true;
        }
        return false;
    }

    function incrementProjNumber (string d) external {
        bytes32 hash = keccak256(d);
        RepositoryDepartment[hash].projNum += 1;
    }
    function decrementProjNumber (string d) external {
        bytes32 hash = keccak256(d);
        RepositoryDepartment[hash].projNum -= 1;
    }
    function projectNum (string d) external view returns (int) {
        bytes32 hash = keccak256(d);
        return RepositoryDepartment[hash].projNum;
    }

}

contract projectManagement {
    function initializeProjInDPT (string d) external;
}